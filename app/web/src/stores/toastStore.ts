import { defineStore } from "pinia";
import { ref } from "vue";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

/**
 * Toast Store
 *
 * Manages the state of global notifications (toasts).
 */
export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);

  /**
   * Add a new toast to the queue
   */
  function addToast(toast: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    toasts.value.push(newToast);

    // Auto-remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }

  /**
   * Remove a toast by its ID
   */
  function removeToast(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  }

  return {
    toasts,
    addToast,
    removeToast,
  };
});
