<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, Loader2, Mail, Lock } from 'lucide-vue-next';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const error = ref<string | null>(null);

const handleLogin = async () => {
  error.value = null;
  try {
    await authStore.login({ email: email.value, password: password.value });
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Invalid email or password';
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
    <Card class="w-full max-w-md bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-xl">
      <CardHeader class="space-y-1 flex flex-col items-center">
        <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
          <LogIn class="w-6 h-6 text-white" />
        </div>
        <CardTitle class="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</CardTitle>
        <CardDescription class="text-slate-600">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <Alert v-if="error" variant="destructive" class="animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>
        <div class="grid gap-2">
          <Label for="email" class="text-sm font-medium text-slate-700">Email</Label>
          <div class="relative">
            <Mail class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              v-model="email" 
              class="pl-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all rounded-lg"
              :disabled="authStore.loading"
            />
          </div>
        </div>
        <div class="grid gap-2">
          <div class="flex items-center justify-between">
            <Label for="password" class="text-sm font-medium text-slate-700">Password</Label>
          </div>
          <div class="relative">
            <Lock class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              id="password" 
              type="password" 
              v-model="password" 
              class="pl-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all rounded-lg"
              :disabled="authStore.loading"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex flex-col gap-4">
        <Button 
          class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
          :disabled="authStore.loading"
          @click="handleLogin"
        >
          <Loader2 v-if="authStore.loading" class="mr-2 h-4 w-4 animate-spin" />
          <span v-else>Sign In</span>
        </Button>
        <p class="text-center text-sm text-slate-600">
          Don't have an account? 
          <router-link to="/register" class="font-semibold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4">
            Sign up
          </router-link>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
