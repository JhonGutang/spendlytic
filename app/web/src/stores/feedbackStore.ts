import { defineStore } from 'pinia';
import { feedbackApi, ruleEngineApi } from '../services/api.service';
import type { FeedbackHistory, UserProgress } from '../types';

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    feedbackHistory: [] as FeedbackHistory[],
    progressHistory: [] as UserProgress[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    latestFeedback: (state) => state.feedbackHistory.slice(0, 3),
    currentProgress: (state) => state.progressHistory[0] || null,
    
    currentWeekMonday(): string {
      const now = new Date();
      const day = now.getDay(); // 0 (Sun) - 6 (Sat)
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday
      
      const monday = new Date(now);
      monday.setDate(diff);
      
      const year = monday.getFullYear();
      const month = String(monday.getMonth() + 1).padStart(2, '0');
      const date = String(monday.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${date}`;
    },

    hasEvaluatedThisWeek(): boolean {
      if (this.progressHistory.length === 0) return false;
      const mondayStr = this.currentWeekMonday;
      return this.progressHistory.some(p => p.week_start === mondayStr);
    },

    canEvaluate(): boolean {
      // Basic check: if never evaluated, always true
      if (this.progressHistory.length === 0) return true;
      
      const mondayStr = this.currentWeekMonday;
      
      // Check if we have progress for this Monday
      return !this.progressHistory.some(p => p.week_start === mondayStr);
    },
  },

  actions: {
    async fetchFeedback() {
      this.loading = true;
      try {
        const data = await feedbackApi.getAll();
        this.feedbackHistory = data;
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch feedback';
      } finally {
        this.loading = false;
      }
    },

    async fetchProgress() {
      this.loading = true;
      try {
        const data = await feedbackApi.getProgress();
        this.progressHistory = data;
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch progress';
      } finally {
        this.loading = false;
      }
    },

    async evaluateRules(date?: string) {
      this.loading = true;
      try {
        const data = await ruleEngineApi.evaluate(date);
        
        // Refetch everything to ensure sync and avoid duplicates in memory
        await Promise.all([
          this.fetchFeedback(),
          this.fetchProgress()
        ]);
        
        return data;
      } catch (err: any) {
        this.error = err.message || 'Failed to evaluate rules';
      } finally {
        this.loading = false;
      }
      return null;
    },

    async acknowledgeFeedback(id: number) {
      try {
        const success = await feedbackApi.acknowledge(id);
        if (success) {
          const item = this.feedbackHistory.find(f => f.id === id);
          if (item) item.user_acknowledged = true;
        }
      } catch (err: any) {
        console.error('Failed to acknowledge feedback', err);
      }
    }
  }
});
