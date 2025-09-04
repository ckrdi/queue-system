<template>
  <form @submit="handleSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for="email">Email</Label>
      <Input id="email" v-model="form.email" type="email" placeholder="your-email@example.com" required />
    </div>
    <div class="space-y-2">
      <Label for="password">Password</Label>
      <Input id="password" v-model="form.password" type="password" placeholder="Enter your password" required />
    </div>
    <Button type="submit" class="w-full" :disabled="loading">
      {{ loading ? 'Signing in...' : 'Sign In' }}
    </Button>
    <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const emit = defineEmits(['success'])

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async (e: any) => {
  e.preventDefault()
  loading.value = true
  error.value = ''

  let isLoggedIn = await authStore.login(form.value)
  loading.value = false
  if (!isLoggedIn) {
    error.value = 'Error/Invalid credentials.'
    return
  }

  emit('success')
}
</script>
