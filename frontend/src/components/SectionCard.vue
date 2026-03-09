<template>
  <div class="rounded-xl border border-slate-200 overflow-hidden">
    <button
      @click="$emit('toggle')"
      class="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50 transition-colors text-left"
    >
      <span class="text-sm font-semibold text-slate-800">{{ title }}</span>
      <div class="flex items-center gap-3">
        <slot name="actions" />
        <svg
        class="w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0"
        :class="{ 'rotate-180': open }"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path d="M3 6l5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      </div>
    </button>
    <div v-show="open" class="px-5 py-4 bg-white border-t border-slate-100">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({ title: String, open: Boolean });
defineEmits(['toggle']);
</script>
