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

export async function downloadPdf(element, filename = 'plan-architecture.pdf') {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let y = 0;
  while (y < imgHeight) {
    if (y > 0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, -y, imgWidth, imgHeight);
    y += pageHeight;
  }

  pdf.save(filename);
}
