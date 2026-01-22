<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Zap, Target, BarChart3, Brain, Sparkles } from 'lucide-vue-next';

const router = useRouter();

const navigateToDashboard = () => {
  router.push('/dashboard');
};

const features = [
  {
    icon: TrendingUp,
    title: 'Category Overspend Detection',
    description: 'Automatically detects when spending in a category exceeds the previous week by 25%, helping you stay aware of spending patterns.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Zap,
    title: 'Weekly Spending Spike Alert',
    description: 'Identifies when total weekly spending is 20% higher than the previous week, providing early warnings before habits form.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Target,
    title: 'Small Purchase Tracking',
    description: 'Monitors frequent small purchases (10+ transactions under $10/week) that often go unnoticed but add up significantly.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div class="text-center">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200 mb-8">
            <Sparkles class="w-4 h-4 text-purple-600" />
            <span class="text-sm font-medium text-slate-700">Engineering-Focused Finance Tracker</span>
          </div>

          <!-- Main Heading -->
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span class="block text-slate-900">Transform Your</span>
            <span class="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Financial Habits
            </span>
          </h1>

          <!-- Subheading -->
          <p class="max-w-2xl mx-auto text-xl sm:text-2xl text-slate-600 mb-10 leading-relaxed">
            An adaptive feedback engine that detects spending patterns and guides behavioral change through 
            <span class="font-semibold text-slate-800">deterministic, rule-based insights</span>
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              @click="navigateToDashboard"
              size="lg"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <BarChart3 class="w-5 h-5 mr-2" />
              View Dashboard
            </Button>
            <Button 
              @click="() => router.push('/transactions')"
              size="lg"
              variant="outline"
              class="px-8 py-6 text-lg rounded-xl border-2 border-slate-300 hover:border-slate-400 hover:bg-white transition-all duration-300"
            >
              Track Transactions
            </Button>
          </div>

          <!-- Stats -->
          <div class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div class="text-center">
              <div class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3</div>
              <div class="text-sm text-slate-600 mt-1">Detection Rules</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">2</div>
              <div class="text-sm text-slate-600 mt-1">Adaptive Levels</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">100%</div>
              <div class="text-sm text-slate-600 mt-1">Deterministic</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-20 bg-white/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left: Icon/Visual -->
          <div class="relative">
            <div class="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-12 shadow-2xl">
              <Brain class="w-full h-full text-white opacity-90" :size="200" />
              <div class="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-3xl"></div>
            </div>
            <!-- Floating accent -->
            <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl shadow-xl opacity-80 blur-sm"></div>
          </div>

          <!-- Right: Content -->
          <div>
            <div class="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              About the System
            </div>
            <h2 class="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Engineering Meets Behavioral Science
            </h2>
            <p class="text-lg text-slate-600 mb-6 leading-relaxed">
              This isn't just another budgeting app. It's an <span class="font-semibold text-slate-800">engineering MVP</span> that explores 
              how deterministic feedback can drive lasting financial behavior change.
            </p>
            <p class="text-lg text-slate-600 mb-6 leading-relaxed">
              Instead of relying on willpower or manual tracking, the system automatically <span class="font-semibold text-slate-800">detects spending patterns</span>, 
              generates <span class="font-semibold text-slate-800">adaptive feedback</span>, and helps you build better habits through measurable, rule-based insights.
            </p>
            
            <!-- Key Points -->
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900">Pattern Detection</h3>
                  <p class="text-slate-600">Automatically identifies spending patterns using deterministic rules</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900">Adaptive Feedback</h3>
                  <p class="text-slate-600">Feedback evolves based on your progress and behavior over time</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900">Testable & Explainable</h3>
                  <p class="text-slate-600">Every insight is backed by clear, measurable metrics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            Core Features
          </div>
          <h2 class="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Three Rules That Drive Change
          </h2>
          <p class="max-w-2xl mx-auto text-lg text-slate-600">
            Our pattern detection engine uses three deterministic rules to identify spending behaviors and generate actionable feedback.
          </p>
        </div>

        <!-- Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card 
            v-for="(feature, index) in features" 
            :key="index"
            class="group relative overflow-hidden border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            <!-- Gradient overlay on hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardHeader class="relative">
              <div :class="['w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110', feature.bgColor]">
                <component :is="feature.icon" :class="['w-7 h-7', feature.color]" />
              </div>
              <CardTitle class="text-xl font-bold text-slate-900 mb-2">
                {{ feature.title }}
              </CardTitle>
            </CardHeader>
            <CardContent class="relative">
              <CardDescription class="text-slate-600 leading-relaxed">
                {{ feature.description }}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <!-- Adaptive Feedback Callout -->
        <div class="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-white shadow-2xl">
          <div class="max-w-3xl mx-auto text-center">
            <Sparkles class="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h3 class="text-3xl font-bold mb-4">Adaptive Feedback System</h3>
            <p class="text-lg text-blue-50 mb-6 leading-relaxed">
              Feedback doesn't stay static. If you break rules 2 weeks in a row, you'll receive simpler, more focused advice. 
              Succeed for 2 weeks? Get more advanced strategies. The system adapts to your progress.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <div class="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                <div class="text-2xl font-bold">Level 1</div>
                <div class="text-sm text-blue-100">Simplified Guidance</div>
              </div>
              <div class="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                <div class="text-2xl font-bold">Level 2</div>
                <div class="text-sm text-blue-100">Advanced Strategies</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-slate-900 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl sm:text-5xl font-bold mb-6">
          Ready to Transform Your Financial Habits?
        </h2>
        <p class="text-xl text-slate-300 mb-10">
          Start tracking your transactions and receive adaptive feedback today.
        </p>
        <Button 
          @click="navigateToDashboard"
          size="lg"
          class="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <BarChart3 class="w-5 h-5 mr-2" />
          Get Started Now
        </Button>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
