/**
 * Post-build prerender.
 *
 * The app is a client-rendered SPA: without this step the deployed HTML is an
 * empty <div id="root">, so crawlers, ATS CV parsers, LinkedIn previews and the
 * LLMs recruiters increasingly use read nothing at all.
 *
 * This script injects a semantic, text-only copy of the CV into #root and
 * regenerates the JSON-LD from the same source of truth (src/data/cv-data-fr.json),
 * so the markup can never drift from the data. React replaces the container on
 * mount (createRoot wipes existing children), so the injected block is what
 * non-JS readers get and a fast first paint for everyone else.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://remirousseau.pro';

const cv = JSON.parse(readFileSync(join(ROOT, 'src/data/cv-data-fr.json'), 'utf8'));
const { personalInfo, experiences, competenceCategories, formations, projetsInternes, recommendations } = cv;

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Recommendation text carries real <br> markup (the app renders it with
// dangerouslySetInnerHTML), so escape everything then restore just the breaks.
const escRich = (v) => esc(v).replace(/&lt;br\s*\/?&gt;/gi, '<br />');

const list = (items) =>
  items?.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '';

const techLine = (label, items) =>
  items?.length ? `<p><strong>${label} :</strong> ${items.map(esc).join(', ')}</p>` : '';

const period = (start, end) => `${esc(start)} – ${end ? esc(end) : 'Présent'}`;

// ---------------------------------------------------------------- sections

const header = `
  <header>
    <h1>${esc(personalInfo.prenom)} ${esc(personalInfo.nom)}</h1>
    <p class="pr-role">Développeur .NET Fullstack — C#/.NET, Angular, React, Python, Flutter</p>
    <p class="pr-meta">
      ${esc(personalInfo.localisation)} ·
      <a href="mailto:${esc(personalInfo.email)}">${esc(personalInfo.email)}</a> ·
      <a href="${esc(personalInfo.linkedin)}" rel="me">LinkedIn</a>
    </p>
    <p>${esc(personalInfo.description)}</p>
  </header>`;

const experienceSection = `
  <section>
    <h2>Expérience professionnelle</h2>
    ${experiences
      .map(
        (e) => `<article>
      <h3>${esc(e.nomDeMission)}${e.context ? ` — ${esc(e.context)}` : ''}</h3>
      <p class="pr-meta">${period(e.dateDebut, e.dateFin)} · ${esc(e.localisation)}</p>
      ${e.mission ? `<p>${esc(e.mission)}</p>` : ''}
      ${list(e.detailsMission)}
      ${techLine('Technologies', e.technologies)}
      ${techLine('Méthodes et outils', e.outils)}
    </article>`
      )
      .join('')}
  </section>`;

const skillsSection = `
  <section>
    <h2>Compétences techniques</h2>
    ${competenceCategories
      .map(
        (c) => `<h3>${esc(c.title1)} ${esc(c.title2)}</h3>
      <ul>${c.competences
        .map(
          (s) =>
            `<li><strong>${esc(s.label)}</strong>${s.description ? ` — ${esc(s.description)}` : ''}</li>`
        )
        .join('')}</ul>`
      )
      .join('')}
  </section>`;

const educationSection = `
  <section>
    <h2>Formation</h2>
    <ul>${formations
      .map(
        (f) =>
          `<li><strong>${esc(f.nomFormation)}</strong> — ${esc(f.nomEcole)}, ${esc(f.localisation)} (${esc(f.dateDebut)} – ${esc(f.dateFin)})</li>`
      )
      .join('')}</ul>
  </section>`;

const projectsSection = `
  <section>
    <h2>Projets personnels et internes</h2>
    ${projetsInternes
      .map((p) => {
        const subs = p.subProjects?.length
          ? `<ul>${p.subProjects
              .map(
                (s) =>
                  `<li><strong>${esc(s.name)}</strong> — ${esc(s.description)}${
                    s.technologies?.length ? ` (${s.technologies.map(esc).join(', ')})` : ''
                  }</li>`
              )
              .join('')}</ul>`
          : '';
        const updates = p.updates?.length
          ? `<ul>${p.updates
              .map((u) => `<li>${esc(u.date)} — ${esc(u.description)}</li>`)
              .join('')}</ul>`
          : '';
        return `<article>
      <h3>${esc(p.name)}</h3>
      <p class="pr-meta">${period(p.startDate, p.endDate)}</p>
      <p>${esc(p.description)}</p>
      ${subs}
      ${techLine('Technologies', p.technologies)}
      ${updates}
    </article>`;
      })
      .join('')}
  </section>`;

const recommendationsSection = `
  <section>
    <h2>Recommandations</h2>
    ${recommendations
      .map(
        (r) => `<blockquote>
      <p>${escRich(r.translated || r.recommendation)}</p>
      <footer>${esc(r.nomPersonne)}, ${esc(r.metier)} — ${esc(r.nomEntreprise)}</footer>
    </blockquote>`
      )
      .join('')}
  </section>`;

const style = `<style>
    #root .pr{max-width:52rem;margin:0 auto;padding:2rem 1.25rem;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.55;color:#1f2937}
    #root .pr h1{font-size:2rem;margin:0 0 .25rem}
    #root .pr h2{font-size:1.25rem;margin:2rem 0 .5rem;border-bottom:1px solid #e5e7eb;padding-bottom:.25rem}
    #root .pr h3{font-size:1rem;margin:1.25rem 0 .25rem}
    #root .pr .pr-role{font-size:1.05rem;color:#2563eb;margin:0 0 .5rem}
    #root .pr .pr-meta{color:#6b7280;font-size:.9rem;margin:.25rem 0}
    #root .pr blockquote{margin:1rem 0;padding-left:1rem;border-left:3px solid #e5e7eb}
  </style>`;

const content = `${style}
  <article class="pr">${header}${experienceSection}${skillsSection}${educationSection}${projectsSection}${recommendationsSection}
  </article>`;

// ---------------------------------------------------------------- JSON-LD

const allSkills = competenceCategories[0].competences.map((s) => s.label);
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: `${personalInfo.prenom} ${personalInfo.nom}`,
  jobTitle: 'Développeur .NET Fullstack',
  description: personalInfo.description,
  url: SITE_URL,
  image: `${SITE_URL}${personalInfo.profileImage}`,
  email: `mailto:${personalInfo.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: personalInfo.localisation.split(',')[0].trim(),
    addressCountry: 'FR',
  },
  sameAs: [personalInfo.linkedin, 'https://github.com/RousseauRemi'],
  knowsAbout: [...allSkills, 'CQRS', 'Clean Architecture', 'Entity Framework Core', 'Docker'],
  knowsLanguage: ['fr', 'en'],
  alumniOf: [
    ...new Set(formations.map((f) => f.nomEcole)),
  ].map((name) => ({ '@type': 'EducationalOrganization', name })),
};

// ---------------------------------------------------------------- injection

const target = join(ROOT, 'dist/index.html');
let html = readFileSync(target, 'utf8');

const rootRe = /<div id="root">\s*<\/div>/;
if (!rootRe.test(html)) {
  throw new Error('prerender: <div id="root"></div> introuvable dans dist/index.html');
}
html = html.replace(rootRe, `<div id="root">${content}</div>`);

const ldRe = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
if (!ldRe.test(html)) {
  throw new Error('prerender: bloc JSON-LD introuvable dans dist/index.html');
}
html = html.replace(
  ldRe,
  `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>`
);

writeFileSync(target, html);
console.log(
  `prerender: ${experiences.length} expériences, ${projetsInternes.length} projets injectés (${(
    Buffer.byteLength(html) / 1024
  ).toFixed(1)} kB)`
);
