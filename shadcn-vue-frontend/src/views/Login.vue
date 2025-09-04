<template>
  <Unauthenticated>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle class="text-2xl text-center">Sign In</CardTitle>
          <CardDescription class="text-center">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm @success="handleLoginSuccess" />
        </CardContent>
      </Card>
    </div>
  </Unauthenticated>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Unauthenticated from '@/layouts/Unauthenticated.vue'
import LoginForm from '@/components/LoginForm.vue'

const router = useRouter()
const handleLoginSuccess = () => router.push('/')
</script>
