<script setup lang="ts">
import { useToastStore } from "@/stores/toastStore";
import BotanicalToast from "./BotanicalToast.vue";

const toastStore = useToastStore();
</script>

<template>
    <div
        class="fixed top-0 right-0 z-[100] flex flex-col gap-4 p-6 pointer-events-none sm:top-6 sm:right-6 max-w-sm w-full">
        <TransitionGroup enter-active-class="transition duration-500 ease-out"
            enter-from-class="opacity-0 translate-x-20" enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition duration-400 ease-in absolute" leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 translate-x-20" move-class="transition duration-500 ease-in-out">
            <BotanicalToast v-for="toast in toastStore.toasts" :key="toast.id" v-bind="toast"
                @close="toastStore.removeToast(toast.id)" />
        </TransitionGroup>
    </div>
</template>

<style scoped>
/* Ensure leave active absolute positioning doesn't collapse the layout during transition */
.v-leave-active {
    position: absolute;
}
</style>
