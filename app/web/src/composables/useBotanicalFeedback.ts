import { useToastStore } from "@/stores/toastStore";

/**
 * useBotanicalFeedback
 *
 * A composable to trigger themed, botanical notifications across the system.
 */
export function useBotanicalFeedback() {
  const toastStore = useToastStore();

  /**
   * Generic success toast
   */
  const notifySuccess = (title: string, message: string) => {
    toastStore.addToast({
      type: "success",
      title,
      message,
    });
  };

  /**
   * Generic error toast
   */
  const notifyError = (title: string, message: string) => {
    toastStore.addToast({
      type: "error",
      title,
      message,
    });
  };

  /**
   * Botanical themed: Seed Sown (Transaction Added)
   */
  const notifySeedSown = (category: string) => {
    toastStore.addToast({
      type: "success",
      title: "Seed Sown",
      message: `A new entry has been successfully planted in ${category}.`,
    });
  };

  /**
   * Botanical themed: Seed Refined (Transaction Updated)
   */
  const notifySeedRefined = (category: string) => {
    toastStore.addToast({
      type: "success",
      title: "Seed Refined",
      message: `The entry in ${category} has been carefully adjusted.`,
    });
  };

  /**
   * Botanical themed: Seed Uprooted (Transaction Deleted)
   */
  const notifySeedUprooted = () => {
    toastStore.addToast({
      type: "warning",
      title: "Seed Uprooted",
      message: "An entry has been removed from the garden ledger.",
    });
  };

  /**
   * Botanical themed: Harvest Integration (CSV Import)
   */
  const notifyHarvestIntegration = (count: number, skipped: number = 0) => {
    const skipText = skipped > 0 ? ` ${skipped} duplicates were pruned.` : "";
    toastStore.addToast({
      type: "success",
      title: "Harvest Integration",
      message: `Garden populated with ${count} new seeds.${skipText}`,
    });
  };

  /**
   * Botanical themed: Wisdom Refreshed (Analysis Complete)
   */
  const notifyWisdomRefreshed = () => {
    toastStore.addToast({
      type: "info",
      title: "Wisdom Refreshed",
      message:
        "The behavioral engine has completed its analysis of your growth.",
    });
  };

  return {
    notifySuccess,
    notifyError,
    notifySeedSown,
    notifySeedRefined,
    notifySeedUprooted,
    notifyHarvestIntegration,
    notifyWisdomRefreshed,
  };
}
