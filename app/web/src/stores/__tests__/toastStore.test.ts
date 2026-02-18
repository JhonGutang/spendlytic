import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useToastStore } from "../toastStore";

describe("ToastStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with no toasts", () => {
    const store = useToastStore();
    expect(store.toasts).toEqual([]);
  });

  it("adds a toast correctly", () => {
    const store = useToastStore();
    const toastData = {
      type: "success" as const,
      title: "Test Title",
      message: "Test Message",
    };

    store.addToast(toastData);

    expect(store.toasts).toHaveLength(1);
    expect(store.toasts[0]).toMatchObject({
      ...toastData,
      id: expect.any(String),
    });
  });

  it("removes a toast correctly", () => {
    const store = useToastStore();
    store.addToast({
      type: "info",
      title: "Remove Me",
      message: "I will be removed",
    });

    const toastId = store.toasts[0]!.id;
    store.removeToast(toastId);

    expect(store.toasts).toHaveLength(0);
  });

  it("automatically removes toast after duration", () => {
    const store = useToastStore();
    const duration = 2000;

    store.addToast({
      type: "warning",
      title: "Auto Dismiss",
      message: "I disappear soon",
      duration,
    });

    expect(store.toasts).toHaveLength(1);

    // Advance timers by the duration
    vi.advanceTimersByTime(duration);

    expect(store.toasts).toHaveLength(0);
  });

  it("honors default duration of 5000ms", () => {
    const store = useToastStore();

    store.addToast({
      type: "success",
      title: "Default Dismiss",
      message: "Wait for it...",
    });

    expect(store.toasts).toHaveLength(1);

    vi.advanceTimersByTime(4999);
    expect(store.toasts).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(store.toasts).toHaveLength(0);
  });
});
