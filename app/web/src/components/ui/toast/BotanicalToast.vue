<script setup lang="ts">
import { computed } from "vue";
import {
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Info,
    X
} from "lucide-vue-next";
import type { ToastType } from "@/stores/toastStore";
import { cn } from "@/lib/utils";

const props = defineProps<{
    type: ToastType;
    title: string;
    message: string;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const icon = computed(() => {
    switch (props.type) {
        case "success": return CheckCircle2;
        case "error": return AlertCircle;
        case "warning": return AlertTriangle;
        case "info": return Info;
        default: return Info;
    }
});

const styles = computed(() => {
    switch (props.type) {
        case "success":
            return {
                container: "border-emerald-100 bg-white/90 shadow-emerald-900/5",
                icon: "text-emerald-600 bg-emerald-50",
                title: "text-emerald-950",
            };
        case "error":
            return {
                container: "border-rose-100 bg-white/90 shadow-rose-900/5",
                icon: "text-rose-600 bg-rose-50",
                title: "text-rose-950",
            };
        case "warning":
            return {
                container: "border-amber-100 bg-white/90 shadow-amber-900/5",
                icon: "text-amber-600 bg-amber-50",
                title: "text-amber-950",
            };
        case "info":
            return {
                container: "border-emerald-100 bg-white/90 shadow-emerald-900/5",
                icon: "text-emerald-600 bg-emerald-50",
                title: "text-emerald-950",
            };
        default:
            return {
                container: "border-emerald-100 bg-white/90 shadow-emerald-900/5",
                icon: "text-emerald-600 bg-emerald-50",
                title: "text-emerald-950",
            };
    }
});
</script>

<template>
    <div v-motion :initial="{ opacity: 0, scale: 0.9, y: 20 }"
        :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }"
        :leave="{ opacity: 0, scale: 0.9, y: -20, transition: { duration: 400, ease: 'easeIn' } }" :class="cn(
            'pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-3xl border backdrop-blur-xl shadow-lg transition-all',
            styles.container
        )">
        <div class="flex w-full p-4 items-start gap-4">
            <!-- Icon -->
            <div :class="cn('flex-shrink-0 p-2 rounded-2xl', styles.icon)">
                <component :is="icon" class="h-5 h-5" />
            </div>

            <!-- Content -->
            <div class="flex-1 pt-1">
                <h3 :class="cn('text-[11px] font-bold uppercase tracking-wider font-serif', styles.title)">
                    {{ title }}
                </h3>
                <p class="mt-1 text-xs text-emerald-900/70 font-inter leading-relaxed">
                    {{ message }}
                </p>
            </div>

            <!-- Close Button -->
            <button @click="emit('close')"
                class="flex-shrink-0 p-1 rounded-full text-emerald-900/20 hover:text-emerald-900/40 transition-colors">
                <X class="h-4 w-4" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.font-serif {
    font-family: 'Playfair Display', serif;
}

.font-inter {
    font-family: 'Inter', sans-serif;
}
</style>
