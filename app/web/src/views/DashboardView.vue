<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useTransactionStore } from '../stores/transactionStore';
import { useCategoryStore } from '../stores/categoryStore';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-vue-next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RouterLink } from 'vue-router';
import { formatDateSafe } from '@/utils';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const formattedIncome = computed(() => 
  transactionStore.summary.total_income.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  })
);

const formattedExpenses = computed(() => 
  transactionStore.summary.total_expenses.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  })
);

const formattedBalance = computed(() => 
  transactionStore.summary.net_balance.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD' 
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
  await Promise.all([
    transactionStore.fetchSummary(),
    categoryStore.fetchCategories(),
  ]);
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Dashboard</h1>
      <p class="text-slate-600 mt-1">Overview of your financial activity</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Income Card -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Income</p>
              <p class="text-2xl font-bold text-green-600 mt-2">{{ formattedIncome }}</p>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <ArrowUpRight class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Expenses Card -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Expenses</p>
              <p class="text-2xl font-bold text-red-600 mt-2">{{ formattedExpenses }}</p>
            </div>
            <div class="bg-red-100 p-3 rounded-lg">
              <ArrowDownRight class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Balance Card -->
      <Card class="bg-gradient-to-br from-primary to-purple-600 border-0">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-white/80">Net Balance</p>
              <p class="text-2xl font-bold text-white mt-2">{{ formattedBalance }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-lg">
              <Wallet class="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Transactions -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="transactionStore.transactions.length === 0" class="text-center py-12">
            <p class="text-slate-500">No transactions yet</p>
            <RouterLink 
              to="/transactions" 
              class="text-primary hover:text-primary/80 text-sm font-medium mt-2 inline-block"
            >
              Add your first transaction →
            </RouterLink>
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="transaction in transactionStore.transactions.slice(0, 5)" 
              :key="transaction.id"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div 
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  ]"
                >
                  <component 
                    :is="transaction.type === 'income' ? TrendingUp : TrendingDown"
                    :class="[
                      'w-5 h-5',
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    ]"
                  />
                </div>
                <div>
                  <p class="font-medium text-slate-900">{{ transaction.category?.name }}</p>
                  <p class="text-sm text-slate-500">{{ formatTransactionDate(transaction.date) }}</p>
                </div>
              </div>
              <p 
                :class="[
                  'font-semibold',
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ transaction.type === 'income' ? '+' : '-' }}${{ transaction.amount }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Expense Breakdown -->
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="transactionStore.expensesByCategory.length === 0" class="text-center py-12">
            <p class="text-slate-500">No expenses yet</p>
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="expense in transactionStore.expensesByCategory.slice(0, 5)" 
              :key="expense.category_id"
              class="space-y-2"
            >
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-slate-700">{{ expense.category.name }}</span>
                <span class="font-semibold text-slate-900">${{ expense.total }}</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full transition-all duration-300"
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
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-slate-50 rounded-lg">
            <p class="text-2xl font-bold text-slate-900">{{ transactionStore.summary.transaction_count }}</p>
            <p class="text-sm text-slate-600 mt-1">Total Transactions</p>
          </div>
          <div class="text-center p-4 bg-slate-50 rounded-lg">
            <p class="text-2xl font-bold text-slate-900">{{ categoryStore.categories.length }}</p>
            <p class="text-sm text-slate-600 mt-1">Categories</p>
          </div>
          <div class="text-center p-4 bg-slate-50 rounded-lg">
            <p class="text-2xl font-bold text-green-600">{{ categoryStore.incomeCategories.length }}</p>
            <p class="text-sm text-slate-600 mt-1">Income Sources</p>
          </div>
          <div class="text-center p-4 bg-slate-50 rounded-lg">
            <p class="text-2xl font-bold text-red-600">{{ categoryStore.expenseCategories.length }}</p>
            <p class="text-sm text-slate-600 mt-1">Expense Types</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
