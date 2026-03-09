<template>
  <div class="max-w-3xl mx-auto px-8 space-y-8">

    <!-- Titre de page -->
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold text-slate-900 tracking-tight">
        Décrivez votre projet
      </h2>
      <p class="text-sm text-slate-500">
        Obtenez une architecture technique, un plan de développement et des recommandations adaptées à votre idée.
      </p>
    </div>

    <!-- Formulaire -->
    <div class="space-y-4">
      <textarea
        id="idea"
        v-model="idea"
        rows="5"
        placeholder="Ex : Une application de gestion de tâches collaborative avec notifications en temps réel, authentification OAuth et export PDF…"
        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none resize-none transition-colors"
      />
      <button
        @click="handleSubmit"
        :disabled="loading || !idea.trim()"
        class="w-full rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {{ loading ? 'Génération en cours…' : 'Générer le plan' }}
      </button>
    </div>

    <!-- Erreur -->
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

    <!-- Exporter -->
    <div v-if="result" class="flex justify-end gap-2">
      <button
        @click="handleExport"
        class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
      >
        Exporter en Markdown
      </button>
      <button
        @click="handleExportPdf"
        :disabled="pdfLoading"
        class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {{ pdfLoading ? 'Génération PDF…' : 'Exporter en PDF' }}
      </button>
    </div>

    <!-- Résultats structurés -->
    <div v-if="result" ref="resultsRef" class="space-y-3">

      <!-- 1. System Prompt -->
      <SectionCard title="Synthèse" :open="open.systemPrompt" @toggle="toggle('systemPrompt')">
        <template #actions>
          <button
            @click.stop="copySystemPrompt"
            class="text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            {{ copied ? 'Copié !' : 'Copier' }}
          </button>
        </template>
        <p class="text-sm text-slate-600 leading-relaxed">{{ result.systemPrompt }}</p>
      </SectionCard>

      <!-- 2. Architecture -->
      <SectionCard title="Architecture" :open="open.architecture" @toggle="toggle('architecture')">
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {{ result.architecture.type }}
            </span>
          </div>
          <p class="text-sm text-slate-600 leading-relaxed">{{ result.architecture.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="c in result.architecture.components"
              :key="c"
              class="text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-600"
            >
              {{ c }}
            </span>
          </div>
        </div>
      </SectionCard>

      <!-- 3. Plan de développement -->
      <SectionCard title="Plan de développement" :open="open.developmentPlan" @toggle="toggle('developmentPlan')">
        <div class="space-y-3">
          <div
            v-for="phase in result.developmentPlan"
            :key="phase.phase"
            class="flex gap-4 py-3 border-b border-slate-100 last:border-0"
          >
            <div class="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500">
              {{ phase.phase }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline justify-between gap-4">
                <span class="text-sm font-medium text-slate-900">{{ phase.title }}</span>
                <span class="text-xs text-slate-400 flex-shrink-0">{{ phase.estimation }}</span>
              </div>
              <p class="text-sm text-slate-500 mt-0.5">{{ phase.description }}</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <!-- 4. Stack recommandée -->
      <SectionCard title="Stack recommandée" :open="open.recommendedStack" @toggle="toggle('recommendedStack')">
        <div class="space-y-4">
          <div
            v-for="[category, items] in stackEntries"
            :key="category"
            class="space-y-1.5"
          >
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest">{{ categoryLabel(category) }}</p>
            <div class="space-y-1">
              <p
                v-for="item in items"
                :key="item"
                class="text-sm text-slate-600"
              >
                {{ item }}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <!-- 5. Stratégie de tests -->
      <SectionCard title="Stratégie de tests" :open="open.testStrategy" @toggle="toggle('testStrategy')">
        <div class="space-y-3">
          <div
            v-for="[key, value] in testEntries"
            :key="key"
            class="py-3 border-b border-slate-100 last:border-0"
          >
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{{ testLabel(key) }}</p>
            <p class="text-sm text-slate-600 leading-relaxed">{{ value }}</p>
          </div>
        </div>
      </SectionCard>

      <!-- 6. Veille technologique -->
      <SectionCard title="Veille technologique" :open="open.techWatch" @toggle="toggle('techWatch')">
        <div class="space-y-3">
          <div
            v-for="item in result.techWatch"
            :key="item.technology"
            class="py-3 border-b border-slate-100 last:border-0"
          >
            <p class="text-sm font-medium text-slate-900">{{ item.technology }}</p>
            <p class="text-sm text-slate-500 mt-0.5">{{ item.reason }}</p>
          </div>
        </div>
      </SectionCard>

      <!-- 7. Alertes obsolescence -->
      <SectionCard title="Alertes obsolescence" :open="open.obsolescenceAlerts" @toggle="toggle('obsolescenceAlerts')">
        <div class="space-y-3">
          <div
            v-for="item in result.obsolescenceAlerts"
            :key="item.technology"
            class="flex gap-4 py-3 border-b border-slate-100 last:border-0"
          >
            <span :class="riskClass(item.risk)" class="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full h-fit mt-0.5">
              {{ riskLabel(item.risk) }}
            </span>
            <div>
              <p class="text-sm font-medium text-slate-900">{{ item.technology }}</p>
              <p class="text-sm text-slate-500 mt-0.5">{{ item.recommendation }}</p>
            </div>
          </div>
        </div>
      </SectionCard>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { generatePlan } from '../services/api.js';
import { planToMarkdown, downloadMarkdown, downloadPdf } from '../services/export.js';
import SectionCard from './SectionCard.vue';

const idea = ref('');
const result = ref(null);
const error = ref('');
const loading = ref(false);
const pdfLoading = ref(false);
const resultsRef = ref(null);
const copied = ref(false);

const open = ref({
  systemPrompt: true,
  architecture: true,
  developmentPlan: true,
  recommendedStack: true,
  testStrategy: true,
  techWatch: true,
  obsolescenceAlerts: true,
});

function toggle(key) {
  open.value[key] = !open.value[key];
}

const stackEntries = computed(() =>
  result.value ? Object.entries(result.value.recommendedStack).filter(([, v]) => v?.length) : []
);

const testEntries = computed(() =>
  result.value ? Object.entries(result.value.testStrategy).filter(([, v]) => v) : []
);

function categoryLabel(key) {
  return { frontend: 'Frontend', backend: 'Backend', database: 'Base de données', infrastructure: 'Infrastructure', other: 'Autre' }[key] ?? key;
}

function testLabel(key) {
  return { unit: 'Tests unitaires', integration: 'Tests d\'intégration', e2e: 'Tests E2E', other: 'Autres' }[key] ?? key;
}

function riskClass(risk) {
  return {
    low: 'bg-emerald-50 text-emerald-700',
    medium: 'bg-amber-50 text-amber-700',
    high: 'bg-red-50 text-red-600',
  }[risk] ?? 'bg-slate-100 text-slate-600';
}

function riskLabel(risk) {
  return { low: 'Faible', medium: 'Moyen', high: 'Élevé' }[risk] ?? risk;
}

async function copySystemPrompt() {
  await navigator.clipboard.writeText(result.value.systemPrompt);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}

function handleExport() {
  const md = planToMarkdown(result.value, idea.value);
  const slug = idea.value.trim().slice(0, 30).replace(/\s+/g, '-').toLowerCase() || 'plan';
  downloadMarkdown(md, `${slug}-architecture.md`);
}

async function handleExportPdf() {
  if (!result.value) return;
  pdfLoading.value = true;
  try {
    const md = planToMarkdown(result.value, idea.value);
    const slug = idea.value.trim().slice(0, 30).replace(/\s+/g, '-').toLowerCase() || 'plan';
    await downloadPdf(md, `${slug}-architecture.pdf`);
  } finally {
    pdfLoading.value = false;
  }
}

async function handleSubmit() {
  error.value = '';
  result.value = null;
  loading.value = true;

  try {
    result.value = await generatePlan(idea.value);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
