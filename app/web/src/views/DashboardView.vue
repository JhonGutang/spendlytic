<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useTransactionStore } from '../stores/transactionStore';
import { useCategoryStore } from '../stores/categoryStore';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-vue-next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RouterLink } from 'vue-router';
import { formatDateSafe } from '@/utils';
import DailyFlowChart from '@/components/charts/DailyFlowChart.vue';
import MonthlyFlowChart from '@/components/charts/MonthlyFlowChart.vue';
import YearlyFlowChart from '@/components/charts/YearlyFlowChart.vue';
import BehavioralInsights from '@/components/feedback/BehavioralInsights.vue';
import InitializationLoader from '@/components/loaders/InitializationLoader.vue';
import type { TimeRange } from '@/types';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const selectedTimeRange = ref<TimeRange>('daily');
const isLoading = ref(true);

const formattedIncome = computed(() => 
  transactionStore.summary.total_income.toLocaleString('en-PH', { 
    style: 'currency', 
    currency: 'PHP' 
  })
);

const formattedExpenses = computed(() => 
  transactionStore.summary.total_expenses.toLocaleString('en-PH', { 
    style: 'currency', 
    currency: 'PHP' 
  })
);

const formattedBalance = computed(() => 
  transactionStore.summary.net_balance.toLocaleString('en-PH', { 
    style: 'currency', 
    currency: 'PHP' 
  })
);

function formatTransactionDate(dateString: string): string {
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-');
    const formattedInput = `${parseInt(month!)}/${parseInt(day!)}/${year}`;
    return formatDateSafe(formattedInput) || dateString;
  }
  return formatDateSafe(dateString) || dateString;
}

onMounted(async () => {
  try {
    const minLoaderTime = new Promise(resolve => setTimeout(resolve, 1500));
    await Promise.all([
      transactionStore.fetchSummary(),
      categoryStore.fetchCategories(),
      minLoaderTime
    ]);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <InitializationLoader v-if="isLoading" />
  <div v-else class="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4 font-inter">
    
    <!-- Background Texture -->
    <div class="fixed inset-0 pointer-events-none opacity-40 mix-blend-multiply -z-10">
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50"></div>
    </div>
    <div class="fixed inset-0 bg-[#FDFCF8] -z-20"></div>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-serif font-medium text-emerald-950 tracking-tight">Dashboard</h1>
        <p class="text-emerald-900/60 mt-2 font-light">Your financial garden at a glance</p>
      </div>
      <div class="hidden md:block">
         <div class="w-10 h-10 bg-emerald-100/50 rounded-full flex items-center justify-center text-emerald-800">
            <Layers class="w-5 h-5" />
         </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Income Card -->
      <Card class="bg-white/60 backdrop-blur-xl border border-emerald-100/50 shadow-sm hover:shadow-md transition-all">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-emerald-900/60 uppercase tracking-wider">Total Income</p>
              <p class="text-3xl font-serif text-emerald-700 mt-2">{{ formattedIncome }}</p>
            </div>
            <div class="bg-emerald-100/50 p-3 rounded-xl">
              <ArrowUpRight class="w-6 h-6 text-emerald-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Expenses Card -->
      <Card class="bg-white/60 backdrop-blur-xl border border-emerald-100/50 shadow-sm hover:shadow-md transition-all">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-emerald-900/60 uppercase tracking-wider">Total Expenses</p>
              <p class="text-3xl font-serif text-rose-700 mt-2">{{ formattedExpenses }}</p>
            </div>
            <div class="bg-rose-100/50 p-3 rounded-xl">
              <ArrowDownRight class="w-6 h-6 text-rose-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Balance Card -->
      <Card class="bg-gradient-to-br from-emerald-900 to-emerald-950 border-0 shadow-lg shadow-emerald-900/20 text-[#FDFCF8]">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-emerald-200/80 uppercase tracking-wider">Net Balance</p>
              <p class="text-3xl font-serif text-white mt-2">{{ formattedBalance }}</p>
            </div>
            <div class="bg-emerald-800/50 p-3 rounded-xl border border-emerald-700/30">
              <Wallet class="w-6 h-6 text-emerald-100" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Behavioral Insights Section -->
    <BehavioralInsights />

    <!-- Money Flow Charts -->
    <Card class="bg-white/60 backdrop-blur-xl border border-emerald-100/50 shadow-sm">
      <CardHeader>
        <CardTitle class="text-xl font-serif text-emerald-950">Money Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs v-model="selectedTimeRange" class="w-full">
          <TabsList class="grid w-full grid-cols-3 mb-8 bg-emerald-100/30 p-1 rounded-xl">
            <TabsTrigger 
              value="daily" 
              class="data-[state=active]:bg-white data-[state=active]:text-emerald-950 data-[state=active]:shadow-sm rounded-lg text-emerald-900/60"
            >Daily</TabsTrigger>
            <TabsTrigger 
              value="monthly"
              class="data-[state=active]:bg-white data-[state=active]:text-emerald-950 data-[state=active]:shadow-sm rounded-lg text-emerald-900/60"
            >Monthly</TabsTrigger>
            <TabsTrigger 
              value="yearly"
              class="data-[state=active]:bg-white data-[state=active]:text-emerald-950 data-[state=active]:shadow-sm rounded-lg text-emerald-900/60"
            >Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" class="mt-0">
            <DailyFlowChart />
          </TabsContent>
          <TabsContent value="monthly" class="mt-0">
            <MonthlyFlowChart />
          </TabsContent>
          <TabsContent value="yearly" class="mt-0">
            <YearlyFlowChart />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Recent Transactions -->
      <Card class="bg-white/60 backdrop-blur-xl border border-emerald-100/50 shadow-sm flex flex-col">
        <CardHeader>
          <CardTitle class="text-xl font-serif text-emerald-950">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent class="flex-1">
          <div v-if="transactionStore.transactions.length === 0" class="text-center py-12">
            <div class="w-12 h-12 bg-emerald-100/50 rounded-full flex items-center justify-center mx-auto mb-3">
                 <Layers class="w-6 h-6 text-emerald-800/50" />
            </div>
            <p class="text-emerald-900/50">No transactions planted yet</p>
            <RouterLink 
              to="/transactions" 
              class="text-emerald-700 hover:text-emerald-800 text-sm font-medium mt-3 inline-block hover:underline underline-offset-4"
            >
              Add your first transaction →
            </RouterLink>
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="transaction in transactionStore.transactions.slice(0, 5)" 
              :key="transaction.id"
              class="flex items-center justify-between p-4 rounded-xl hover:bg-white/80 transition-all border border-transparent hover:border-emerald-100/50 group"
            >
              <div class="flex items-center space-x-4">
                <div 
                  :class="[
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                    transaction.type === 'income' ? 'bg-emerald-100/50 text-emerald-700 group-hover:bg-emerald-100' : 'bg-rose-100/50 text-rose-700 group-hover:bg-rose-100'
                  ]"
                >
                  <component 
                    :is="transaction.type === 'income' ? TrendingUp : TrendingDown"
                    class="w-5 h-5"
                  />
                </div>
                <div>
                  <p class="font-medium text-emerald-950">{{ transaction.category?.name }}</p>
                  <p class="text-xs text-emerald-900/50 uppercase tracking-wide mt-0.5">{{ formatTransactionDate(transaction.date) }}</p>
                </div>
              </div>
              <p 
                :class="[
                  'font-semibold font-serif',
                  transaction.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                ]"
              >
                {{ transaction.type === 'income' ? '+' : '-' }}₱{{ transaction.amount }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Expense Breakdown -->
      <Card class="bg-white/60 backdrop-blur-xl border border-emerald-100/50 shadow-sm">
        <CardHeader>
          <CardTitle class="text-xl font-serif text-emerald-950">Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="transactionStore.expensesByCategory.length === 0" class="text-center py-12">
            <p class="text-emerald-900/50">No expenses recorded</p>
          </div>
          <div v-else class="space-y-5">
            <div 
              v-for="expense in transactionStore.expensesByCategory.slice(0, 5)" 
              :key="expense.category_id"
              class="space-y-2"
            >
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-emerald-900">{{ expense.category.name }}</span>
                <span class="font-semibold text-emerald-950">₱{{ expense.total }}</span>
              </div>
              <div class="w-full bg-emerald-100/30 rounded-full h-2">
                <div 
                  class="bg-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
                  :style="{ 
                    width: `${(expense.total / transactionStore.summary.total_expenses) * 100}%` 
                  }"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quick Stats -->
    <Card class="bg-white/60 backdrop-blur-xl border border-emerald-100/50 shadow-sm mb-12">
      <CardHeader>
        <CardTitle class="text-xl font-serif text-emerald-950">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100/20">
            <p class="text-3xl font-serif font-medium text-emerald-950">{{ transactionStore.summary.transaction_count }}</p>
            <p class="text-xs text-emerald-900/50 uppercase tracking-widest mt-2">Total Transactions</p>
          </div>
          <div class="text-center p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100/20">
            <p class="text-3xl font-serif font-medium text-emerald-950">{{ categoryStore.categories.length }}</p>
            <p class="text-xs text-emerald-900/50 uppercase tracking-widest mt-2">Categories</p>
          </div>
          <div class="text-center p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100/20">
            <p class="text-3xl font-serif font-medium text-emerald-700">{{ categoryStore.incomeCategories.length }}</p>
            <p class="text-xs text-emerald-900/50 uppercase tracking-widest mt-2">Income Sources</p>
          </div>
          <div class="text-center p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100/20">
            <p class="text-3xl font-serif font-medium text-rose-700">{{ categoryStore.expenseCategories.length }}</p>
            <p class="text-xs text-emerald-900/50 uppercase tracking-widest mt-2">Expense Types</p>
          </div>
        </div>
      </CardContent>
    </Card>
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
