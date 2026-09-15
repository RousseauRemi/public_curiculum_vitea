/**
 * Post-build prerender, one static page per language.
 *
 * The app is a client-rendered SPA: without this step the deployed HTML is an
 * empty <div id="root">, so crawlers, ATS CV parsers, LinkedIn previews and the
 * LLMs recruiters increasingly use read nothing at all.
 *
 * English is the default language and lives at /, French at /fr/. For each one this
 * script takes the built dist/index.html and:
 *   - regenerates the SEO block between <!-- SEO:START --> and <!-- SEO:END -->
 *     (title, description, Open Graph, canonical, hreflang, JSON-LD),
 *   - sets <html lang>,
 *   - injects a semantic, text-only copy of the CV into #root.
 * Everything comes from src/data/cv-data-<lang>.json, so the markup can never drift from
 * the data. React replaces the container on mount (createRoot wipes existing children), so
 * the injected block is what non-JS readers get and a fast first paint for everyone else.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://remirousseau.pro';

const LANGS = {
  en: {
    path: '/',
    out: 'dist/index.html',
    htmlLang: 'en',
    ogLocale: 'en_US',
    ogLocaleAlternate: 'fr_FR',
    jobTitle: 'Full-Stack .NET Developer',
    title: 'Rémi Rousseau - Full-Stack .NET Developer (C#, Angular, React, Flutter)',
    description:
      'Full-stack .NET developer with 12+ years of experience: C# / .NET 8-9, DDD, CQRS and Clean Architecture, Angular and React front ends, Flutter mobile.',
    keywords:
      'Rémi Rousseau, .NET developer, C#, .NET 8, .NET 9, full-stack, DDD, Domain-Driven Design, CQRS, Clean Architecture, Entity Framework Core, Angular, React, Flutter, Python, Nantes, France',
    labels: {
      role: 'Full-Stack .NET Developer — C#/.NET, Angular, React, Python, Flutter',
      experience: 'Professional experience',
      skills: 'Technical skills',
      education: 'Education',
      projects: 'Personal and internal projects',
      recommendations: 'Recommendations',
      present: 'Present',
      technologies: 'Technologies',
      methods: 'Methods and tools',
    },
  },
  fr: {
    path: '/fr/',
    out: 'dist/fr/index.html',
    htmlLang: 'fr',
    ogLocale: 'fr_FR',
    ogLocaleAlternate: 'en_US',
    jobTitle: 'Développeur .NET Fullstack',
    title: 'Rémi Rousseau - Développeur .NET Fullstack (C#, Angular, React, Flutter)',
    description:
      "Développeur .NET Fullstack, plus de 12 ans d'expérience : C# / .NET 8-9, DDD, CQRS et Clean Architecture, fronts Angular et React, mobile Flutter.",
    keywords:
      'Rémi Rousseau, développeur .NET, C#, .NET 8, .NET 9, fullstack, DDD, Domain-Driven Design, CQRS, Clean Architecture, Entity Framework Core, Angular, React, Flutter, Python, Nantes',
    labels: {
      role: 'Développeur .NET Fullstack — C#/.NET, Angular, React, Python, Flutter',
      experience: 'Expérience professionnelle',
      skills: 'Compétences techniques',
      education: 'Formation',
      projects: 'Projets personnels et internes',
      recommendations: 'Recommandations',
      present: 'Présent',
      technologies: 'Technologies',
      methods: 'Méthodes et outils',
    },
  },
};

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

const url = (path) => `${SITE_URL}${path}`;

// ---------------------------------------------------------------- page content

function renderContent(cv, L) {
  const { personalInfo, experiences, competenceCategories, formations, projetsInternes, recommendations } = cv;
  const techLine = (label, items) =>
    items?.length ? `<p><strong>${label} :</strong> ${items.map(esc).join(', ')}</p>` : '';
  const period = (start, end) => `${esc(start)} – ${end ? esc(end) : L.labels.present}`;

  const header = `
  <header>
    <h1>${esc(personalInfo.prenom)} ${esc(personalInfo.nom)}</h1>
    <p class="pr-role">${esc(L.labels.role)}</p>
    <p class="pr-meta">
      ${esc(personalInfo.localisation)} ·
      <a href="mailto:${esc(personalInfo.email)}">${esc(personalInfo.email)}</a> ·
      <a href="${esc(personalInfo.linkedin)}" rel="me">LinkedIn</a>
    </p>
    <p>${esc(personalInfo.description)}</p>
  </header>`;

  const experienceSection = `
  <section>
    <h2>${L.labels.experience}</h2>
    ${experiences
      .map(
        (e) => `<article>
      <h3>${esc(e.nomDeMission)}${e.context ? ` — ${esc(e.context)}` : ''}</h3>
      <p class="pr-meta">${period(e.dateDebut, e.dateFin)} · ${esc(e.localisation)}</p>
      ${e.mission ? `<p>${esc(e.mission)}</p>` : ''}
      ${list(e.detailsMission)}
      ${techLine(L.labels.technologies, e.technologies)}
      ${techLine(L.labels.methods, e.outils)}
    </article>`
      )
      .join('')}
  </section>`;

  const skillsSection = `
  <section>
    <h2>${L.labels.skills}</h2>
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
    <h2>${L.labels.education}</h2>
    <ul>${formations
      .map(
        (f) =>
          `<li><strong>${esc(f.nomFormation)}</strong> — ${esc(f.nomEcole)}, ${esc(f.localisation)} (${esc(f.dateDebut)} – ${esc(f.dateFin)})</li>`
      )
      .join('')}</ul>
  </section>`;

  const projectsSection = `
  <section>
    <h2>${L.labels.projects}</h2>
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
          ? `<ul>${p.updates.map((u) => `<li>${esc(u.date)} — ${esc(u.description)}</li>`).join('')}</ul>`
          : '';
        return `<article>
      <h3>${esc(p.name)}</h3>
      <p class="pr-meta">${period(p.startDate, p.endDate)}</p>
      <p>${esc(p.description)}</p>
      ${subs}
      ${techLine(L.labels.technologies, p.technologies)}
      ${updates}
    </article>`;
      })
      .join('')}
  </section>`;

  // The site shows each recommendation in its original language with a translation on demand.
  // Non-JS readers get the original, followed by the translation if any.
  const recommendationsSection = `
  <section>
    <h2>${L.labels.recommendations}</h2>
    ${recommendations
      .map(
        (r) => `<blockquote>
      <p>${escRich(r.recommendation)}</p>
      ${r.translated ? `<p class="pr-meta">${escRich(r.translated)}</p>` : ''}
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

  return `${style}
  <article class="pr">${header}${experienceSection}${skillsSection}${educationSection}${projectsSection}${recommendationsSection}
  </article>`;
}

// ---------------------------------------------------------------- <head> SEO block

function renderSeo(cv, L) {
  const { personalInfo, competenceCategories, formations } = cv;
  const canonical = url(L.path);
  const image = url(personalInfo.profileImage);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: `${personalInfo.prenom} ${personalInfo.nom}`,
    jobTitle: L.jobTitle,
    description: personalInfo.description,
    url: canonical,
    image,
    email: `mailto:${personalInfo.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: personalInfo.localisation.split(',')[0].trim(),
      addressCountry: 'FR',
    },
    sameAs: [personalInfo.linkedin],
    knowsAbout: [
      ...competenceCategories[0].competences.map((s) => s.label),
      'Domain-Driven Design',
      'CQRS',
      'Clean Architecture',
      'Entity Framework Core',
      'Docker',
    ],
    knowsLanguage: ['en', 'fr'],
    alumniOf: [...new Set(formations.map((f) => f.nomEcole))].map((name) => ({
      '@type': 'EducationalOrganization',
      name,
    })),
  };

  const alternates = Object.values(LANGS)
    .map((l) => `    <link rel="alternate" hreflang="${l.htmlLang}" href="${url(l.path)}" />`)
    .join('\n');

  return `<!-- SEO:START (generated by scripts/prerender.mjs) -->
    <title>${esc(L.title)}</title>
    <meta name="description" content="${esc(L.description)}" />
    <meta name="keywords" content="${esc(L.keywords)}" />
    <meta name="author" content="${esc(personalInfo.prenom)} ${esc(personalInfo.nom)}" />
    <meta name="robots" content="index, follow" />

    <link rel="canonical" href="${canonical}" />
${alternates}
    <link rel="alternate" hreflang="x-default" href="${url(LANGS.en.path)}" />

    <meta property="og:type" content="profile" />
    <meta property="og:title" content="${esc(L.title)}" />
    <meta property="og:description" content="${esc(L.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="Rémi Rousseau" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1014" />
    <meta property="og:image:height" content="1001" />
    <meta property="og:image:alt" content="Rémi Rousseau" />
    <meta property="og:locale" content="${L.ogLocale}" />
    <meta property="og:locale:alternate" content="${L.ogLocaleAlternate}" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${esc(L.title)}" />
    <meta name="twitter:description" content="${esc(L.description)}" />
    <meta name="twitter:image" content="${image}" />

    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>
    <!-- SEO:END -->`;
}

// ---------------------------------------------------------------- build both pages

const template = readFileSync(join(ROOT, 'dist/index.html'), 'utf8');
const seoRe = /<!-- SEO:START[\s\S]*?<!-- SEO:END -->/;
const rootRe = /<div id="root">\s*<\/div>/;
const langRe = /<html lang="[a-z-]+">/;
for (const [re, what] of [[seoRe, 'bloc SEO:START/SEO:END'], [rootRe, '<div id="root"></div>'], [langRe, '<html lang>']]) {
  if (!re.test(template)) throw new Error(`prerender: ${what} introuvable dans dist/index.html`);
}

for (const [code, L] of Object.entries(LANGS)) {
  const cv = JSON.parse(readFileSync(join(ROOT, `src/data/cv-data-${code}.json`), 'utf8'));
  const html = template
    .replace(langRe, `<html lang="${L.htmlLang}">`)
    .replace(seoRe, renderSeo(cv, L))
    .replace(rootRe, `<div id="root">${renderContent(cv, L)}</div>`);

  const target = join(ROOT, L.out);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
  console.log(
    `prerender ${code}: ${L.path} → ${L.out} (${cv.experiences.length} expériences, ${cv.projetsInternes.length} projets, ${(
      Buffer.byteLength(html) / 1024
    ).toFixed(1)} kB)`
  );
}
