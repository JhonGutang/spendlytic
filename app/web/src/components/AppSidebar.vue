<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { LayoutDashboard, Receipt, Menu } from 'lucide-vue-next';

interface Props {
  isCollapsed: boolean;
  isMobileOpen?: boolean;
}

interface Emits {
  (e: 'toggle-collapse'): void;
  (e: 'close-mobile'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const route = useRoute();

const navItems = [
  {
    to: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
    exact: true,
  },
  {
    to: '/transactions',
    icon: Receipt,
    label: 'Transactions',
    exact: false,
  },
];

const isActive = (item: typeof navItems[0]) => {
  if (item.exact) {
    return route.path === item.to;
  }
  return route.path.startsWith(item.to);
};

const handleNavClick = () => {
  if (props.isMobileOpen) {
    emit('close-mobile');
  }
};
</script>

<template>
  <aside
    :class="[
      'flex flex-col bg-white border-r border-slate-200 transition-all duration-300 h-screen',
      isCollapsed ? 'w-16' : 'w-60',
    ]"
  >
    <!-- Sidebar Header: Logo + Toggle -->
    <div class="h-16 flex items-center px-4 border-b border-slate-200 gap-3">
      <button
        @click="emit('toggle-collapse')"
        class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu class="w-5 h-5 text-slate-600" />
      </button>
      
      <transition name="fade">
        <h1 v-if="!isCollapsed" class="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent truncate">
          Finance Tracker
        </h1>
      </transition>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        @click="handleNavClick"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
          isActive(item)
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          isCollapsed ? 'justify-center' : '',
        ]"
      >
        <component
          :is="item.icon"
          :class="[
            'w-5 h-5 flex-shrink-0',
            isActive(item) ? 'text-primary' : 'text-slate-500 group-hover:text-slate-700',
          ]"
        />
        <transition name="fade">
          <span v-if="!isCollapsed" class="text-sm whitespace-nowrap">
            {{ item.label }}
          </span>
        </transition>
      </RouterLink>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-slate-200">
      <div
        :class="[
          'flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50',
          isCollapsed ? 'justify-center' : '',
        ]"
      >
        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
          U
        </div>
        <transition name="fade">
          <div v-if="!isCollapsed" class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-900 truncate">User</p>
            <p class="text-xs text-slate-500 truncate">user@example.com</p>
          </div>
        </transition>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full;
}
</style>
