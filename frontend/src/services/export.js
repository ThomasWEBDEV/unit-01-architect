const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Base de données',
  infrastructure: 'Infrastructure',
  other: 'Autre',
};

const TEST_LABELS = {
  unit: 'Tests unitaires',
  integration: "Tests d'intégration",
  e2e: 'Tests E2E',
  other: 'Autres',
};

const RISK_LABELS = {
  low: 'Faible',
  medium: 'Moyen',
  high: 'Élevé',
};

export function planToMarkdown(result, idea = '') {
  const lines = [];

  lines.push('# Plan d\'architecture UNIT-01');
  if (idea) lines.push(`\n> ${idea}`);
  lines.push(`\n_Généré le ${new Date().toLocaleDateString('fr-FR', { dateStyle: 'long' })}_`);

  // 1. Synthèse
  lines.push('\n---\n');
  lines.push('## 1. Synthèse\n');
  lines.push(result.systemPrompt);

  // 2. Architecture
  lines.push('\n---\n');
  lines.push('## 2. Architecture\n');
  lines.push(`**Type :** ${result.architecture.type}\n`);
  lines.push(result.architecture.description);
  if (result.architecture.components?.length) {
    lines.push('\n**Composants :**');
    for (const c of result.architecture.components) {
      lines.push(`- ${c}`);
    }
  }

  // 3. Plan de développement
  lines.push('\n---\n');
  lines.push('## 3. Plan de développement\n');
  for (const phase of result.developmentPlan) {
    lines.push(`### Phase ${phase.phase} — ${phase.title} _(${phase.estimation})_\n`);
    lines.push(phase.description);
    lines.push('');
  }

  // 4. Stack recommandée
  lines.push('---\n');
  lines.push('## 4. Stack recommandée\n');
  for (const [key, items] of Object.entries(result.recommendedStack)) {
    if (!items?.length) continue;
    lines.push(`**${CATEGORY_LABELS[key] ?? key} :**`);
    for (const item of items) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  // 5. Stratégie de tests
  lines.push('---\n');
  lines.push('## 5. Stratégie de tests\n');
  for (const [key, value] of Object.entries(result.testStrategy)) {
    if (!value) continue;
    lines.push(`**${TEST_LABELS[key] ?? key} :** ${value}\n`);
  }

  // 6. Veille technologique
  lines.push('---\n');
  lines.push('## 6. Veille technologique\n');
  for (const item of result.techWatch) {
    lines.push(`- **${item.technology}** — ${item.reason}`);
  }

  // 7. Alertes obsolescence
  lines.push('\n---\n');
  lines.push('## 7. Alertes obsolescence\n');
  for (const item of result.obsolescenceAlerts) {
    const risk = RISK_LABELS[item.risk] ?? item.risk;
    lines.push(`- **${item.technology}** \`[${risk}]\` — ${item.recommendation}`);
  }

  return lines.join('\n');
}

export function downloadMarkdown(content, filename = 'plan-architecture.md') {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadPdf(markdownContent, filename = 'plan-architecture.pdf') {
  const { jsPDF } = await import('jspdf');

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(needed) {
    if (y + needed > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  }

  function renderText(text, fontSize, style, r, g, b) {
    pdf.setFont('helvetica', style);
    pdf.setFontSize(fontSize);
    pdf.setTextColor(r, g, b);
    const lines = pdf.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 1.4;
    checkPageBreak(lines.length * lineHeight);
    pdf.text(lines, margin, y);
    y += lines.length * lineHeight;
  }

  const strip = (s) => s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`(.*?)`/g, '$1');

  for (const line of markdownContent.split('\n')) {
    if (line.startsWith('# ')) {
      y += 8;
      renderText(line.slice(2), 22, 'bold', 15, 15, 15);
      y += 6;
    } else if (line.startsWith('## ')) {
      y += 12;
      checkPageBreak(30);
      renderText(line.slice(3), 16, 'bold', 30, 30, 30);
      y += 4;
    } else if (line.startsWith('### ')) {
      y += 8;
      renderText(line.slice(4), 13, 'bold', 50, 50, 50);
      y += 2;
    } else if (line.startsWith('---')) {
      y += 4;
      checkPageBreak(10);
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 10;
    } else if (line.startsWith('> ')) {
      renderText(line.slice(2), 11, 'italic', 80, 80, 80);
    } else if (line.startsWith('- ')) {
      renderText('• ' + strip(line.slice(2)), 11, 'normal', 40, 40, 40);
      y += 1;
    } else if (line.startsWith('_') && line.endsWith('_') && line.length > 2) {
      renderText(line.slice(1, -1), 10, 'italic', 100, 100, 100);
    } else if (line.trim() === '') {
      y += 6;
    } else {
      renderText(strip(line), 11, 'normal', 40, 40, 40);
      y += 1;
    }
  }

  pdf.save(filename);
}
