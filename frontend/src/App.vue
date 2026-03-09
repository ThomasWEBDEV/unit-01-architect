<script setup>
import IdeaForm from './components/IdeaForm.vue';
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900">
    <header class="border-b border-slate-200 px-8 py-5">
      <div class="max-w-3xl mx-auto flex items-baseline justify-between">
        <div>
          <span class="text-lg font-semibold tracking-tight text-slate-900">Unit-01 Architect</span>
        </div>
        <span class="text-sm text-slate-400">Assistant de conception logicielle</span>
      </div>
    </header>
    <main class="py-16">
      <IdeaForm />
    </main>
  </div>
</template>
