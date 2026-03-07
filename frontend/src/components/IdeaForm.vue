<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <div>
      <label for="idea" class="block text-sm font-medium text-gray-700 mb-2">
        Décrivez votre idée de projet
      </label>
      <textarea
        id="idea"
        v-model="idea"
        rows="4"
        placeholder="Ex : Une application de gestion de tâches collaborative en temps réel..."
        class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
      />
    </div>

    <button
      @click="handleSubmit"
      :disabled="loading || !idea.trim()"
      class="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {{ loading ? 'Génération en cours…' : 'Générer le plan' }}
    </button>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

    <div v-if="result" class="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <pre class="whitespace-pre-wrap text-sm text-gray-800 font-sans">{{ result }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { generatePlan } from '../services/api.js';

const idea = ref('');
const result = ref('');
const error = ref('');
const loading = ref(false);

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
