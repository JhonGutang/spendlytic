<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Motion } from 'motion-v';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  Brain, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  MousePointerClick,
  Layers,
  Fingerprint
} from 'lucide-vue-next';

const router = useRouter();

const navigateToDashboard = () => {
  router.push('/dashboard');
};

const features = [
  {
    icon: TrendingUp,
    title: 'Smart Alerts',
    description: 'Catch spending spikes before they become permanent habits.',
    color: 'emerald',
    delay: 0.1
  },
  {
    icon: Zap,
    title: 'Personal Growth',
    description: 'Insights that evolve with you as your spending improves.',
    color: 'indigo',
    delay: 0.2
  },
  {
    icon: Target,
    title: 'Habit Mastery',
    description: 'Uncover hidden patterns and build a healthier future.',
    color: 'blue',
    delay: 0.3
  }
];

const stats = [
  { label: 'Habits Analyzed', value: '10k+' },
  { label: 'User Progress', value: '85%' },
  { label: 'Focus Areas', value: '3' }
];
</script>

<template>
  <div class="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30 overflow-hidden">
    <!-- Ambient Background -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style="animation-duration: 8s"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    </div>

    <!-- Navigation -->
    <Motion 
      as="nav"
      :initial="{ y: -20, opacity: 0 }"
      :animate="{ y: 0, opacity: 1 }"
      class="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto"
    >
      <div class="flex items-center gap-2 group cursor-pointer">
        <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
          <Layers class="w-6 h-6 text-white" />
        </div>
        <span class="text-xl font-bold tracking-tight text-white">Spendlytic</span>
      </div>
      <div class="flex items-center gap-6 text-sm font-medium">
        <button @click="navigateToDashboard" class="hover:text-emerald-400 transition-colors">Sign In</button>
        <Button @click="navigateToDashboard" variant="default" class="bg-white text-slate-950 hover:bg-emerald-400 hover:text-white transition-all rounded-full px-6">
          Start Journey
        </Button>
      </div>
    </Motion>

    <!-- Hero Section -->
    <section class="relative pt-20 pb-16 px-6 max-w-7xl mx-auto">
      <div class="flex flex-col items-center text-center">
        <!-- Badge -->
        <Motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ delay: 0.2 }"
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold mb-8 backdrop-blur-md"
        >
          <Sparkles class="w-3 h-3" />
          <span>TAKE CHARGE OF YOUR FINANCES</span>
        </Motion>

        <!-- Main Heading -->
        <div class="relative max-w-4xl">
          <Motion
            as="h1"
            :initial="{ opacity: 0, filter: 'blur(10px)', y: 20 }"
            :animate="{ opacity: 1, filter: 'blur(0px)', y: 0 }"
            :transition="{ duration: 0.8, ease: 'easeOut' }"
            class="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]"
          >
            Master Your <br />
            <span class="bg-gradient-to-r from-emerald-400 via-indigo-400 to-emerald-400 bg-size-200 animate-gradient bg-clip-text text-transparent">
              Spending Habits
            </span>
          </Motion>
        </div>

        <!-- Subheading -->
        <Motion
          as="p"
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.4, duration: 0.6 }"
          class="max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed"
        >
          Stop wondering where your money went. Build a healthier relationship with your finances through 
          intelligent, supportive insights designed to help you grow.
        </Motion>

        <!-- CTAs -->
        <Motion
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.6, duration: 0.6 }"
          class="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Button 
            @click="navigateToDashboard"
            class="h-14 px-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-bold text-lg shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Start Your Journey
            <ArrowRight class="ml-2 w-5 h-5" />
          </Button>
          <button 
            @click="() => router.push('/transactions')"
            class="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-4 px-6 rounded-2xl border border-transparent hover:border-slate-800"
          >
            <MousePointerClick class="w-5 h-5" />
            <span>Discover How It Works</span>
          </button>
        </Motion>

        <!-- Stats Grid -->
        <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <Motion
            v-for="(stat, i) in stats"
            :key="i"
            :initial="{ opacity: 0, scale: 0.9 }"
            :animate="{ opacity: 1, scale: 1 }"
            :transition="{ delay: 0.8 + (i * 0.1) }"
            class="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl group hover:border-emerald-500/30 transition-all"
          >
            <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{{ stat.label }}</div>
            <div class="text-4xl font-black text-white group-hover:text-emerald-400 transition-colors">{{ stat.value }}</div>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Bento Section -->
    <section class="py-24 px-6 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-full">
        <!-- Main Feature Bento -->
        <Motion
          :while-hover="{ scale: 1.01 }"
          class="md:col-span-2 md:row-span-2 p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 relative overflow-hidden group"
        >
          <div class="relative z-10 flex flex-col h-full">
            <div class="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Brain class="w-8 h-8 text-indigo-400" />
            </div>
            <h3 class="text-3xl font-bold text-white mb-4">Intelligent Habit Tracking</h3>
            <p class="text-slate-400 lg:w-4/5 leading-relaxed">
              Our system doesn't just list transactions. It identifies the "why" behind your spending patterns and provides gentle, constructive feedback to help you stay on track.
            </p>
            <div class="mt-auto pt-8">
              <div class="flex gap-2">
                <span class="px-3 py-1 bg-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Mindful Spending</span>
                <span class="px-3 py-1 bg-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Goal Aligned</span>
              </div>
            </div>
          </div>
          <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
        </Motion>

        <!-- Feature Grid Cards -->
        <Motion
          v-for="(feature, i) in features"
          :key="i"
          class="p-8 rounded-[2rem] border border-slate-800 bg-slate-900/30 backdrop-blur-sm flex flex-col hover:border-slate-700 transition-all group"
        >
          <div :class="`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-${feature.color}-500/10`">
            <component :is="feature.icon" :class="`w-5 h-5 text-${feature.color}-400`" />
          </div>
          <h4 class="text-lg font-bold text-white mb-2">{{ feature.title }}</h4>
          <p class="text-sm text-slate-500">{{ feature.description }}</p>
        </Motion>

        <!-- Call to Action Bento -->
        <Motion
          class="md:col-span-1 p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 flex flex-col justify-center items-center text-center group cursor-pointer"
          @click="navigateToDashboard"
        >
          <div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Fingerprint class="w-6 h-6 text-emerald-400" />
          </div>
          <div class="text-sm font-bold text-emerald-400 mb-1">SECURE PRIVACY</div>
          <div class="text-xs text-slate-500">Your Data, Your Control</div>
        </Motion>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-slate-900 py-12 px-6">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex items-center gap-2">
          <Layers class="w-5 h-5 text-emerald-500" />
          <span class="font-bold text-white">Spendlytic</span>
        </div>
        <div class="flex gap-8 text-sm text-slate-500">
          <a href="#" class="hover:text-emerald-400 transition-colors">Manifesto</a>
          <a href="#" class="hover:text-emerald-400 transition-colors">Architecture</a>
          <a href="#" class="hover:text-emerald-400 transition-colors">Security</a>
        </div>
        <div class="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck class="w-4 h-4" />
          <span>Deterministic Integrity Guaranteed</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background-size: 200% auto;
  animation: gradient 5s ease infinite;
}

.bg-size-200 {
  background-size: 200% 200%;
}

@keyframes pulse {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.15; transform: scale(1.05); }
}

.animate-pulse {
  animation: pulse 6s ease-in-out infinite;
}

/* Custom colors for dynamic class names */
.bg-emerald-500\/10 { background-color: rgb(16 185 129 / 0.1); }
.bg-indigo-500\/10 { background-color: rgb(99 102 241 / 0.1); }
.bg-blue-500\/10 { background-color: rgb(59 130 246 / 0.1); }
.text-emerald-400 { color: rgb(52 211 153); }
.text-indigo-400 { color: rgb(129 140 248); }
.text-blue-400 { color: rgb(96 165 250); }
</style>
