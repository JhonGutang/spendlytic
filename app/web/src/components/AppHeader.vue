<script setup lang="ts">
import { Bell, Sun, Moon } from 'lucide-vue-next';
import { ref } from 'vue';

interface Props {
  isCollapsed: boolean;
}

defineProps<Props>();

// Theme state (placeholder for future implementation)
const isDarkMode = ref(false);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  // TODO: Implement actual theme switching logic
  console.log('Theme toggle clicked:', isDarkMode.value ? 'dark' : 'light');
};
</script>

<template>
  <header class="w-full bg-white border-b border-slate-200 backdrop-blur-sm bg-white/90 flex-shrink-0">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6">
      <!-- Left Section: Empty (Title moved to sidebar) -->
      <div class="flex items-center">
        <!-- Optional: Page title could go here later -->
      </div>

      <!-- Right Section: Notifications + Theme Toggle -->
      <div class="flex items-center gap-2">
        <!-- Notification Button -->
        <button
          class="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell class="w-5 h-5 text-slate-600" />
          <!-- Notification Badge (placeholder) -->
          <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- Theme Toggle Button -->
        <button
          @click="toggleTheme"
          class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle theme"
        >
          <Sun v-if="!isDarkMode" class="w-5 h-5 text-slate-600" />
          <Moon v-else class="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </div>
  </header>
</template>
