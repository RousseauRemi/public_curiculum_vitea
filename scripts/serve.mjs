#!/usr/bin/env node
/**
 * Lance le CV en local et ouvre le navigateur.
 *
 *   npm run serve          build de production (avec prérendu) puis preview
 *   npm run serve:dev      serveur de dev avec rechargement à chaud
 *
 * Options : --port <n>   port d'écoute (défaut 4173 en prod, 3000 en dev)
 *           --no-open    ne pas ouvrir le navigateur
 *           --host-only  écoute uniquement sur localhost (défaut : toutes les
 *                        interfaces, pour pouvoir ouvrir la page depuis une
 *                        autre machine du réseau — une VM, un téléphone)
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { networkInterfaces, platform } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);

const dev = has('--dev');
const portIndex = argv.indexOf('--port');
const requestedPort = Number(portIndex !== -1 ? argv[portIndex + 1] : dev ? 3000 : 4173);
const host = has('--host-only') ? '127.0.0.1' : '0.0.0.0';

/** Vite bascule silencieusement sur un autre port s'il est pris — on veut
 *  connaître le port réel avant d'afficher l'URL et d'ouvrir le navigateur. */
const isFree = (p) =>
  new Promise((resolve) => {
    const probe = createServer()
      .once('error', () => resolve(false))
      .once('listening', () => probe.close(() => resolve(true)))
      .listen(p, host === '0.0.0.0' ? undefined : host);
  });

let port = requestedPort;
while (!(await isFree(port))) {
  if (port - requestedPort >= 20) {
    console.error(`✗ Aucun port libre entre ${requestedPort} et ${port}. Relance avec --port <n>.`);
    process.exit(1);
  }
  port += 1;
}
if (port !== requestedPort) {
  console.log(`ℹ Le port ${requestedPort} est occupé, utilisation du port ${port}.`);
}

const run = (cmd, args, label) => {
  const res = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
  if (res.status !== 0) {
    console.error(`\n✗ ${label} a échoué.`);
    process.exit(res.status ?? 1);
  }
};

if (!existsSync(join(ROOT, 'node_modules'))) {
  console.log('→ node_modules absent, installation des dépendances…\n');
  run('npm', ['install'], 'npm install');
}

if (!dev) {
  // Vite vide dist/ avant de builder. Si le dossier a été produit par un autre
  // utilisateur (build lancé en root, dans un conteneur ou via un agent), la
  // suppression échoue avec un EACCES illisible — on le dit clairement.
  const dist = join(ROOT, 'dist');
  if (existsSync(dist)) {
    try {
      rmSync(dist, { recursive: true, force: true });
    } catch (err) {
      if (err.code === 'EACCES' || err.code === 'EPERM') {
        console.error(
          `\n✗ Impossible de supprimer ${dist} : il appartient à un autre utilisateur.\n` +
            `  Corrige avec :  sudo chown -R "$USER" dist\n`
        );
        process.exit(1);
      }
      throw err;
    }
  }
  console.log('→ build de production (TypeScript + Vite + prérendu)…\n');
  run('npm', ['run', 'build'], 'Le build');
}

const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((i) => i && i.family === 'IPv4' && !i.internal)
  .map((i) => i.address);

const localUrl = `http://localhost:${port}/`;

console.log(`\n  CV disponible sur :`);
console.log(`    → ${localUrl}`);
if (host !== '127.0.0.1') {
  for (const address of lanAddresses) console.log(`    → http://${address}:${port}/  (réseau local)`);
}
console.log(dev ? '\n  Mode dev : rechargement à chaud actif.' : '\n  Build de production : le contenu prérendu est servi.');
console.log('  Ctrl+C pour arrêter.\n');

const vite = spawn(
  'npx',
  ['vite', ...(dev ? [] : ['preview']), '--host', host, '--port', String(port), '--strictPort'],
  { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' }
);

// Ouvre le navigateur une fois le serveur prêt, sauf en environnement sans affichage.
const canOpen = !has('--no-open') && (platform() !== 'linux' || process.env.DISPLAY || process.env.WAYLAND_DISPLAY);
if (canOpen) {
  setTimeout(() => {
    const opener = platform() === 'darwin' ? 'open' : platform() === 'win32' ? 'start' : 'xdg-open';
    spawn(opener, [localUrl], { stdio: 'ignore', detached: true, shell: platform() === 'win32' }).unref();
  }, 1500);
}

const stop = () => {
  vite.kill('SIGINT');
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
vite.on('exit', (code) => process.exit(code ?? 0));
