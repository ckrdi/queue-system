<template>
  <form @submit="handleSubmit" class="space-y-4">
    <Button type="submit" class="w-full" :disabled="loading">
      {{ loading ? 'Creating...' : 'Create' }}
    </Button>
    <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import to from 'await-to-js'
import api from '@/api'

const emit = defineEmits(['success'])

const loading = ref(false)
const error = ref('')

const handleSubmit = async (e: any) => {
  e.preventDefault()
  loading.value = true
  error.value = ''

  const [err, res] = await to(api.post('/queues', { type: 'WalkIn' }))
  if (err) {
    console.error('Failed to create queue:', err)
    error.value = 'Failed to create queue'
    loading.value = false
    return
  }

  console.log(res.data)
  loading.value = false
  emit('success')
}
</script>
