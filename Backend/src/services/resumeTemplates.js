/**
 * Professional ATS-compliant single-page resume templates.
 * Designed to strictly fit onto 1 single A4 page with high ATS readability.
 */

const AVAILABLE_TEMPLATES = [
    {
        id: "harvard",
        name: "Harvard ATS Classic",
        tagline: "Most used by Fortune 500, FAANG & Top Firms",
        badge: "Recommended #1",
        atsScore: "99% ATS Friendly",
        font: "Georgia / Serif",
        description: "The universal Ivy League standard. Single-column, crisp dividers, standard reverse-chronological order, 100% ATS parse rate."
    },
    {
        id: "modern",
        name: "Silicon Valley Modern Tech",
        tagline: "Optimized for Software Engineers & Tech Startups",
        badge: "Tech Standard",
        atsScore: "98% ATS Friendly",
        font: "Inter / Sans-Serif",
        description: "Modern tech layout with sleek slate/navy accents, clean skill badges, and quantifiable impact bullets (Google XYZ format)."
    },
    {
        id: "executive",
        name: "Executive Minimalist",
        tagline: "Best for Senior, Corporate & Leadership Roles",
        badge: "Corporate Choice",
        atsScore: "99% ATS Friendly",
        font: "Segoe UI / Clean",
        description: "Sophisticated minimalist styling featuring a tailored Executive Summary aligning leadership experience with target company objectives."
    },
    {
        id: "compact",
        name: "Clean High-Density ATS",
        tagline: "Maximizes Content Space for Heavy Technical Portfolios",
        badge: "High Density",
        atsScore: "97% ATS Friendly",
        font: "Helvetica / Arial",
        description: "Ultra-compact single-page layout engineered for rich technical projects, internships, and extensive developer toolsets."
    }
];

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderContacts(contact, separator = "|") {
    if (!contact) return "";
    const items = [];
    if (contact.phone) items.push(escapeHtml(contact.phone));
    if (contact.email) items.push(`<a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a>`);
    if (contact.location) items.push(escapeHtml(contact.location));
    if (contact.linkedin) {
        const url = contact.linkedin.startsWith("http") ? contact.linkedin : `https://${contact.linkedin}`;
        items.push(`<a href="${escapeHtml(url)}" target="_blank" rel="noopener">LinkedIn</a>`);
    }
    if (contact.github) {
        const url = contact.github.startsWith("http") ? contact.github : `https://${contact.github}`;
        items.push(`<a href="${escapeHtml(url)}" target="_blank" rel="noopener">GitHub</a>`);
    }
    if (contact.portfolio) {
        const url = contact.portfolio.startsWith("http") ? contact.portfolio : `https://${contact.portfolio}`;
        items.push(`<a href="${escapeHtml(url)}" target="_blank" rel="noopener">Portfolio</a>`);
    }

    return items.join(` <span class="sep">${separator}</span> `);
}

// ── 1. Harvard ATS Classic ──────────────────────────────────────────────────
function renderHarvard(data) {
    const contactHtml = renderContacts(data.contact, "|");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(data.fullName)} - Resume</title>
<style>
  @page {
    size: A4 portrait;
    margin: 8mm 10mm;
  }
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body {
    width: 100%;
    height: 100%;
    max-height: 281mm;
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #111827;
    font-family: 'Times New Roman', Times, Georgia, serif;
    font-size: 9.5pt;
    line-height: 1.28;
    overflow: hidden;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  a {
    color: #111827;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .page {
    width: 100%;
    max-height: 281mm;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  header {
    text-align: center;
    margin-bottom: 6px;
  }
  .name {
    font-size: 16pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 2px;
  }
  .sub-title {
    font-size: 9.5pt;
    font-style: italic;
    color: #374151;
    margin-bottom: 3px;
  }
  .contact-bar {
    font-size: 8.5pt;
    color: #374151;
  }
  .contact-bar .sep {
    color: #9ca3af;
    margin: 0 4px;
  }
  .section {
    margin-top: 5px;
  }
  .section-title {
    font-size: 10pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 1.2px solid #111827;
    padding-bottom: 1px;
    margin-bottom: 4px;
  }
  .summary-text {
    font-size: 9pt;
    text-align: justify;
    line-height: 1.28;
  }
  .entry {
    margin-bottom: 4px;
  }
  .entry:last-child {
    margin-bottom: 0;
  }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 9.5pt;
  }
  .entry-title {
    font-weight: bold;
  }
  .entry-company {
    font-style: italic;
  }
  .entry-right {
    font-size: 8.5pt;
    color: #374151;
    text-align: right;
    white-space: nowrap;
  }
  .bullet-list {
    margin-top: 2px;
    padding-left: 14px;
    list-style-type: disc;
  }
  .bullet-list li {
    font-size: 9pt;
    line-height: 1.26;
    margin-bottom: 1.5px;
    color: #1f2937;
  }
  .skills-block {
    font-size: 9pt;
    line-height: 1.32;
  }
  .skill-group {
    margin-bottom: 2px;
  }
  .skill-group strong {
    font-weight: bold;
    color: #111827;
  }
  .skill-items {
    color: #374151;
  }
  .edu-row {
    display: flex;
    justify-content: space-between;
    font-size: 9pt;
    margin-bottom: 2px;
  }
  .edu-deg {
    font-weight: bold;
  }
  .edu-inst {
    font-style: italic;
    color: #374151;
  }
  .edu-details {
    font-size: 8.5pt;
    color: #4b5563;
    margin-top: 1px;
  }
</style>
</head>
<body>
<div class="page">
  <header>
    <div class="name">${escapeHtml(data.fullName)}</div>
    ${data.title ? `<div class="sub-title">${escapeHtml(data.title)}</div>` : ""}
    <div class="contact-bar">${contactHtml}</div>
  </header>

  ${data.summary ? `
  <section class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary-text">${escapeHtml(data.summary)}</p>
  </section>` : ""}

  ${data.skills && data.skills.length > 0 ? `
  <section class="section">
    <div class="section-title">Technical Skills &amp; Competencies</div>
    <div class="skills-block">
      ${data.skills.map(s => `
        <div class="skill-group">
          <strong>${escapeHtml(s.category)}:</strong>
          <span class="skill-items">${s.items ? s.items.map(escapeHtml).join(", ") : ""}</span>
        </div>
      `).join("")}
    </div>
  </section>` : ""}

  ${data.experience && data.experience.length > 0 ? `
  <section class="section">
    <div class="section-title">Professional Experience</div>
    ${data.experience.map(exp => `
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">${escapeHtml(exp.role)}</span>
            ${exp.company ? ` | <span class="entry-company">${escapeHtml(exp.company)}</span>` : ""}
          </div>
          <div class="entry-right">
            ${escapeHtml(exp.dates || "")}${exp.location ? ` | ${escapeHtml(exp.location)}` : ""}
          </div>
        </div>
        ${exp.bullets && exp.bullets.length > 0 ? `
        <ul class="bullet-list">
          ${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>` : ""}
      </div>
    `).join("")}
  </section>` : ""}

  ${data.projects && data.projects.length > 0 ? `
  <section class="section">
    <div class="section-title">Key Technical Projects</div>
    ${data.projects.map(p => `
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">${escapeHtml(p.name)}</span>
            ${p.techStack ? ` <span class="entry-company">(${escapeHtml(p.techStack)})</span>` : ""}
          </div>
          <div class="entry-right">${p.link ? `<a href="${escapeHtml(p.link)}" target="_blank">Project Link</a>` : ""}</div>
        </div>
        ${p.bullets && p.bullets.length > 0 ? `
        <ul class="bullet-list">
          ${p.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>` : ""}
      </div>
    `).join("")}
  </section>` : ""}

  ${data.education && data.education.length > 0 ? `
  <section class="section">
    <div class="section-title">Education</div>
    ${data.education.map(edu => `
      <div class="edu-row">
        <div>
          <span class="edu-deg">${escapeHtml(edu.degree)}</span> — <span class="edu-inst">${escapeHtml(edu.institution)}</span>
          ${edu.details ? `<div class="edu-details">${escapeHtml(edu.details)}</div>` : ""}
        </div>
        <div class="entry-right">
          ${escapeHtml(edu.year || "")}${edu.location ? ` | ${escapeHtml(edu.location)}` : ""}
        </div>
      </div>
    `).join("")}
  </section>` : ""}

  ${data.certifications && data.certifications.length > 0 ? `
  <section class="section">
    <div class="section-title">Certifications &amp; Achievements</div>
    <ul class="bullet-list" style="margin-top: 2px;">
      ${data.certifications.map(c => `<li>${escapeHtml(c)}</li>`).join("")}
    </ul>
  </section>` : ""}
</div>
</body>
</html>`;
}

// ── 2. Silicon Valley Modern Tech ───────────────────────────────────────────
function renderModern(data) {
    const contactHtml = renderContacts(data.contact, "•");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(data.fullName)} - Modern Resume</title>
<style>
  @page {
    size: A4 portrait;
    margin: 8mm 10mm;
  }
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body {
    width: 100%;
    height: 100%;
    max-height: 281mm;
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #1e293b;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 9.3pt;
    line-height: 1.28;
    overflow: hidden;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  a {
    color: #2563eb;
    text-decoration: none;
  }
  .page {
    width: 100%;
    max-height: 281mm;
    display: flex;
    flex-direction: column;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 5px;
    margin-bottom: 6px;
  }
  .name {
    font-size: 17pt;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.3px;
    line-height: 1.1;
  }
  .sub-title {
    font-size: 10pt;
    font-weight: 600;
    color: #2563eb;
    margin-top: 2px;
  }
  .contact-bar {
    font-size: 8pt;
    color: #475569;
    text-align: right;
    line-height: 1.35;
  }
  .contact-bar .sep {
    color: #cbd5e1;
    margin: 0 3px;
  }
  .section {
    margin-top: 5px;
  }
  .section-title {
    font-size: 9.8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }
  .section-title::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
  .summary-text {
    font-size: 9pt;
    color: #334155;
    line-height: 1.3;
  }
  .entry {
    margin-bottom: 4px;
  }
  .entry:last-child {
    margin-bottom: 0;
  }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 9.3pt;
  }
  .entry-title {
    font-weight: 700;
    color: #0f172a;
  }
  .entry-company {
    font-weight: 600;
    color: #2563eb;
  }
  .entry-right {
    font-size: 8.3pt;
    font-weight: 500;
    color: #64748b;
    white-space: nowrap;
  }
  .bullet-list {
    margin-top: 2px;
    padding-left: 14px;
    list-style-type: square;
  }
  .bullet-list li {
    font-size: 8.8pt;
    line-height: 1.25;
    margin-bottom: 1.5px;
    color: #334155;
  }
  .skills-grid {
    display: flex;
    flex-direction: column;
    gap: 2.5px;
  }
  .skill-row {
    font-size: 8.8pt;
    display: flex;
    line-height: 1.26;
  }
  .skill-label {
    width: 135px;
    font-weight: 700;
    color: #0f172a;
    flex-shrink: 0;
  }
  .skill-values {
    color: #334155;
  }
  .edu-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 8.8pt;
    margin-bottom: 2px;
  }
  .edu-title {
    font-weight: 700;
    color: #0f172a;
  }
  .edu-inst {
    color: #475569;
  }
  .edu-details {
    font-size: 8.2pt;
    color: #64748b;
  }
</style>
</head>
<body>
<div class="page">
  <header>
    <div>
      <div class="name">${escapeHtml(data.fullName)}</div>
      ${data.title ? `<div class="sub-title">${escapeHtml(data.title)}</div>` : ""}
    </div>
    <div class="contact-bar">${contactHtml}</div>
  </header>

  ${data.summary ? `
  <section class="section">
    <div class="section-title">Profile Summary</div>
    <p class="summary-text">${escapeHtml(data.summary)}</p>
  </section>` : ""}

  ${data.skills && data.skills.length > 0 ? `
  <section class="section">
    <div class="section-title">Technical Expertise</div>
    <div class="skills-grid">
      ${data.skills.map(s => `
        <div class="skill-row">
          <span class="skill-label">${escapeHtml(s.category)}</span>
          <span class="skill-values">${s.items ? s.items.map(escapeHtml).join(" • ") : ""}</span>
        </div>
      `).join("")}
    </div>
  </section>` : ""}

  ${data.experience && data.experience.length > 0 ? `
  <section class="section">
    <div class="section-title">Work Experience</div>
    ${data.experience.map(exp => `
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">${escapeHtml(exp.role)}</span>
            ${exp.company ? ` | <span class="entry-company">${escapeHtml(exp.company)}</span>` : ""}
          </div>
          <div class="entry-right">
            ${escapeHtml(exp.dates || "")}${exp.location ? ` | ${escapeHtml(exp.location)}` : ""}
          </div>
        </div>
        ${exp.bullets && exp.bullets.length > 0 ? `
        <ul class="bullet-list">
          ${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>` : ""}
      </div>
    `).join("")}
  </section>` : ""}

  ${data.projects && data.projects.length > 0 ? `
  <section class="section">
    <div class="section-title">Featured Projects</div>
    ${data.projects.map(p => `
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">${escapeHtml(p.name)}</span>
            ${p.techStack ? ` <span style="color:#64748b; font-size:8.3pt;">— [${escapeHtml(p.techStack)}]</span>` : ""}
          </div>
          <div class="entry-right">${p.link ? `<a href="${escapeHtml(p.link)}" target="_blank">Demo / GitHub</a>` : ""}</div>
        </div>
        ${p.bullets && p.bullets.length > 0 ? `
        <ul class="bullet-list">
          ${p.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>` : ""}
      </div>
    `).join("")}
  </section>` : ""}

  ${data.education && data.education.length > 0 ? `
  <section class="section">
    <div class="section-title">Education</div>
    ${data.education.map(edu => `
      <div class="edu-row">
        <div>
          <span class="edu-title">${escapeHtml(edu.degree)}</span> — <span class="edu-inst">${escapeHtml(edu.institution)}</span>
          ${edu.details ? `<div class="edu-details">${escapeHtml(edu.details)}</div>` : ""}
        </div>
        <div class="entry-right">${escapeHtml(edu.year || "")}${edu.location ? ` | ${escapeHtml(edu.location)}` : ""}</div>
      </div>
    `).join("")}
  </section>` : ""}

  ${data.certifications && data.certifications.length > 0 ? `
  <section class="section">
    <div class="section-title">Certifications &amp; Honors</div>
    <ul class="bullet-list">
      ${data.certifications.map(c => `<li>${escapeHtml(c)}</li>`).join("")}
    </ul>
  </section>` : ""}
</div>
</body>
</html>`;
}

// ── 3. Executive Minimalist ─────────────────────────────────────────────────
function renderExecutive(data) {
    const contactHtml = renderContacts(data.contact, "—");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(data.fullName)} - Executive Resume</title>
<style>
  @page {
    size: A4 portrait;
    margin: 8mm 10mm;
  }
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body {
    width: 100%;
    height: 100%;
    max-height: 281mm;
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #18181b;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    font-size: 9.3pt;
    line-height: 1.28;
    overflow: hidden;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  a {
    color: #0f172a;
    text-decoration: underline;
  }
  .page {
    width: 100%;
    max-height: 281mm;
    display: flex;
    flex-direction: column;
  }
  header {
    text-align: center;
    border-bottom: 1.5px solid #27272a;
    padding-bottom: 5px;
    margin-bottom: 6px;
  }
  .name {
    font-size: 16.5pt;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #09090b;
  }
  .sub-title {
    font-size: 9.8pt;
    font-weight: 500;
    color: #52525b;
    margin-top: 1px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  .contact-bar {
    font-size: 8.3pt;
    color: #52525b;
    margin-top: 3px;
  }
  .contact-bar .sep {
    color: #a1a1aa;
    margin: 0 4px;
  }
  .summary-box {
    background: #f8fafc;
    border-left: 3px solid #0f172a;
    padding: 4px 8px;
    margin-top: 4px;
    font-size: 8.8pt;
    line-height: 1.28;
    color: #334155;
  }
  .section {
    margin-top: 5px;
  }
  .section-title {
    font-size: 9.8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #09090b;
    border-bottom: 1px solid #d4d4d8;
    padding-bottom: 1px;
    margin-bottom: 4px;
  }
  .entry {
    margin-bottom: 4px;
  }
  .entry:last-child {
    margin-bottom: 0;
  }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 9.3pt;
  }
  .entry-title {
    font-weight: 700;
    color: #18181b;
  }
  .entry-company {
    color: #52525b;
    font-weight: 500;
  }
  .entry-right {
    font-size: 8.3pt;
    color: #71717a;
    white-space: nowrap;
  }
  .bullet-list {
    margin-top: 2px;
    padding-left: 14px;
    list-style-type: circle;
  }
  .bullet-list li {
    font-size: 8.8pt;
    line-height: 1.25;
    margin-bottom: 1.5px;
    color: #27272a;
  }
  .skills-table {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 8.8pt;
  }
  .skill-row {
    display: flex;
    gap: 8px;
  }
  .skill-category {
    font-weight: 700;
    color: #18181b;
    min-width: 140px;
    flex-shrink: 0;
  }
  .skill-list {
    color: #3f3f46;
  }
  .edu-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 8.8pt;
    margin-bottom: 2px;
  }
  .edu-deg {
    font-weight: 700;
    color: #18181b;
  }
  .edu-inst {
    color: #52525b;
  }
  .edu-details {
    font-size: 8.2pt;
    color: #71717a;
  }
</style>
</head>
<body>
<div class="page">
  <header>
    <div class="name">${escapeHtml(data.fullName)}</div>
    ${data.title ? `<div class="sub-title">${escapeHtml(data.title)}</div>` : ""}
    <div class="contact-bar">${contactHtml}</div>
  </header>

  ${data.summary ? `
  <div class="summary-box">
    <strong>Executive Summary:</strong> ${escapeHtml(data.summary)}
  </div>` : ""}

  ${data.skills && data.skills.length > 0 ? `
  <section class="section">
    <div class="section-title">Core Competencies &amp; Technical Skills</div>
    <div class="skills-table">
      ${data.skills.map(s => `
        <div class="skill-row">
          <span class="skill-category">${escapeHtml(s.category)}:</span>
          <span class="skill-list">${s.items ? s.items.map(escapeHtml).join(" • ") : ""}</span>
        </div>
      `).join("")}
    </div>
  </section>` : ""}

  ${data.experience && data.experience.length > 0 ? `
  <section class="section">
    <div class="section-title">Professional Experience</div>
    ${data.experience.map(exp => `
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">${escapeHtml(exp.role)}</span>
            ${exp.company ? ` — <span class="entry-company">${escapeHtml(exp.company)}</span>` : ""}
          </div>
          <div class="entry-right">
            ${escapeHtml(exp.dates || "")}${exp.location ? ` | ${escapeHtml(exp.location)}` : ""}
          </div>
        </div>
        ${exp.bullets && exp.bullets.length > 0 ? `
        <ul class="bullet-list">
          ${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>` : ""}
      </div>
    `).join("")}
  </section>` : ""}

  ${data.projects && data.projects.length > 0 ? `
  <section class="section">
    <div class="section-title">Key Initiatives &amp; Projects</div>
    ${data.projects.map(p => `
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">${escapeHtml(p.name)}</span>
            ${p.techStack ? ` <span class="entry-company">[${escapeHtml(p.techStack)}]</span>` : ""}
          </div>
          <div class="entry-right">${p.link ? `<a href="${escapeHtml(p.link)}" target="_blank">View Project</a>` : ""}</div>
        </div>
        ${p.bullets && p.bullets.length > 0 ? `
        <ul class="bullet-list">
          ${p.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>` : ""}
      </div>
    `).join("")}
  </section>` : ""}

  ${data.education && data.education.length > 0 ? `
  <section class="section">
    <div class="section-title">Education &amp; Credentials</div>
    ${data.education.map(edu => `
      <div class="edu-row">
        <div>
          <span class="edu-deg">${escapeHtml(edu.degree)}</span> — <span class="edu-inst">${escapeHtml(edu.institution)}</span>
          ${edu.details ? `<div class="edu-details">${escapeHtml(edu.details)}</div>` : ""}
        </div>
        <div class="entry-right">${escapeHtml(edu.year || "")}${edu.location ? ` | ${escapeHtml(edu.location)}` : ""}</div>
      </div>
    `).join("")}
  </section>` : ""}

  ${data.certifications && data.certifications.length > 0 ? `
  <section class="section">
    <div class="section-title">Certifications &amp; Accreditations</div>
    <ul class="bullet-list">
      ${data.certifications.map(c => `<li>${escapeHtml(c)}</li>`).join("")}
    </ul>
  </section>` : ""}
</div>
</body>
</html>`;
}

// ── 4. Clean High-Density ATS ───────────────────────────────────────────────
function renderCompact(data) {
    const contactHtml = renderContacts(data.contact, "/");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(data.fullName)} - High Density Resume</title>
<style>
  @page {
    size: A4 portrait;
    margin: 7mm 9mm;
  }
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body {
    width: 100%;
    height: 100%;
    max-height: 283mm;
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #111;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9pt;
    line-height: 1.25;
    overflow: hidden;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  a {
    color: #111;
    text-decoration: underline;
  }
  .page {
    width: 100%;
    max-height: 283mm;
    display: flex;
    flex-direction: column;
  }
  header {
    text-align: center;
    border-bottom: 1.5px solid #111;
    padding-bottom: 4px;
    margin-bottom: 5px;
  }
  .name {
    font-size: 15.5pt;
    font-weight: bold;
    letter-spacing: 0.5px;
  }
  .sub-title {
    font-size: 9pt;
    font-weight: bold;
    color: #444;
  }
  .contact-bar {
    font-size: 8pt;
    color: #444;
    margin-top: 2px;
  }
  .contact-bar .sep {
    color: #999;
    margin: 0 3px;
  }
  .section {
    margin-top: 4px;
  }
  .section-title {
    font-size: 9.5pt;
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 1px solid #111;
    padding-bottom: 1px;
    margin-bottom: 3px;
    letter-spacing: 0.4px;
  }
  .summary-text {
    font-size: 8.8pt;
    line-height: 1.25;
  }
  .entry {
    margin-bottom: 3.5px;
  }
  .entry:last-child {
    margin-bottom: 0;
  }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 9pt;
  }
  .entry-title {
    font-weight: bold;
  }
  .entry-company {
    font-style: italic;
  }
  .entry-right {
    font-size: 8pt;
    color: #444;
    white-space: nowrap;
  }
  .bullet-list {
    margin-top: 1.5px;
    padding-left: 13px;
    list-style-type: disc;
  }
  .bullet-list li {
    font-size: 8.7pt;
    line-height: 1.24;
    margin-bottom: 1.5px;
  }
  .skills-block {
    font-size: 8.7pt;
    line-height: 1.26;
  }
  .skill-group {
    margin-bottom: 1.5px;
  }
  .skill-group strong {
    font-weight: bold;
  }
  .edu-row {
    display: flex;
    justify-content: space-between;
    font-size: 8.7pt;
    margin-bottom: 1.5px;
  }
  .edu-deg {
    font-weight: bold;
  }
  .edu-inst {
    font-style: italic;
    color: #444;
  }
</style>
</head>
<body>
<div class="page">
  <header>
    <div class="name">${escapeHtml(data.fullName)}</div>
    ${data.title ? `<div class="sub-title">${escapeHtml(data.title)}</div>` : ""}
    <div class="contact-bar">${contactHtml}</div>
  </header>

  ${data.summary ? `
  <section class="section">
    <div class="section-title">Summary</div>
    <p class="summary-text">${escapeHtml(data.summary)}</p>
  </section>` : ""}

  ${data.skills && data.skills.length > 0 ? `
  <section class="section">
    <div class="section-title">Technical Skills</div>
    <div class="skills-block">
      ${data.skills.map(s => `
        <div class="skill-group">
          <strong>${escapeHtml(s.category)}:</strong> ${s.items ? s.items.map(escapeHtml).join(", ") : ""}
        </div>
      `).join("")}
    </div>
  </section>` : ""}

  ${data.experience && data.experience.length > 0 ? `
  <section class="section">
    <div class="section-title">Experience</div>
    ${data.experience.map(exp => `
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">${escapeHtml(exp.role)}</span>
            ${exp.company ? ` | <span class="entry-company">${escapeHtml(exp.company)}</span>` : ""}
          </div>
          <div class="entry-right">
            ${escapeHtml(exp.dates || "")}${exp.location ? ` | ${escapeHtml(exp.location)}` : ""}
          </div>
        </div>
        ${exp.bullets && exp.bullets.length > 0 ? `
        <ul class="bullet-list">
          ${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>` : ""}
      </div>
    `).join("")}
  </section>` : ""}

  ${data.projects && data.projects.length > 0 ? `
  <section class="section">
    <div class="section-title">Projects</div>
    ${data.projects.map(p => `
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">${escapeHtml(p.name)}</span>
            ${p.techStack ? ` <span class="entry-company">(${escapeHtml(p.techStack)})</span>` : ""}
          </div>
          <div class="entry-right">${p.link ? `<a href="${escapeHtml(p.link)}" target="_blank">Link</a>` : ""}</div>
        </div>
        ${p.bullets && p.bullets.length > 0 ? `
        <ul class="bullet-list">
          ${p.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
        </ul>` : ""}
      </div>
    `).join("")}
  </section>` : ""}

  ${data.education && data.education.length > 0 ? `
  <section class="section">
    <div class="section-title">Education</div>
    ${data.education.map(edu => `
      <div class="edu-row">
        <div>
          <span class="edu-deg">${escapeHtml(edu.degree)}</span> — <span class="edu-inst">${escapeHtml(edu.institution)}</span>
          ${edu.details ? ` <span style="color:#555; font-size:8.2pt;">(${escapeHtml(edu.details)})</span>` : ""}
        </div>
        <div class="entry-right">${escapeHtml(edu.year || "")}</div>
      </div>
    `).join("")}
  </section>` : ""}

  ${data.certifications && data.certifications.length > 0 ? `
  <section class="section">
    <div class="section-title">Certifications</div>
    <ul class="bullet-list">
      ${data.certifications.map(c => `<li>${escapeHtml(c)}</li>`).join("")}
    </ul>
  </section>` : ""}
</div>
</body>
</html>`;
}

function renderResumeHtml(data, templateId = "harvard") {
    switch (templateId?.toLowerCase()) {
        case "modern":
            return renderModern(data);
        case "executive":
            return renderExecutive(data);
        case "compact":
            return renderCompact(data);
        case "harvard":
        default:
            return renderHarvard(data);
    }
}

module.exports = {
    AVAILABLE_TEMPLATES,
    renderResumeHtml
};
