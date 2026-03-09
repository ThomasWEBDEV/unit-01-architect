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
        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none focus:ring-0 resize-none transition-colors"
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
    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>

    <!-- Résultat -->
    <div v-if="result" class="border-t border-slate-200 pt-8 space-y-3">
      <p class="text-xs font-medium text-slate-400 uppercase tracking-widest">Plan généré</p>
      <div
        class="prose prose-sm max-w-none
          prose-headings:font-semibold prose-headings:text-slate-900 prose-headings:tracking-tight
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-li:text-slate-600
          prose-strong:text-slate-900 prose-strong:font-medium
          prose-code:text-slate-700 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
          prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200 prose-pre:rounded-xl
          prose-a:text-slate-900 prose-a:underline prose-a:underline-offset-2"
        v-html="renderedResult"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { marked } from 'marked';
import { generatePlan } from '../services/api.js';

const idea = ref('');
const result = ref('');
const error = ref('');
const loading = ref(false);
const renderedResult = computed(() => result.value ? marked.parse(result.value) : '');

async function handleSubmit() {
  error.value = '';
  result.value = '';
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
