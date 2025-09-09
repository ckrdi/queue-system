<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import Unauthenticated from '@/layouts/Unauthenticated.vue'

type DisplayData = {
  queueNo: string
  type: 'Reservation' | 'WalkIn'
  staff?: string
}

const current = ref<DisplayData | null>(null)
let socket: Socket

onMounted(() => {
  socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api')
  socket.on('queue-called', (data: DisplayData) => {
    console.log('hello queue called')
    current.value = data
  })
})
</script>

<template>
  <Unauthenticated>
    <div class="h-screen flex flex-col items-center justify-center bg-slate-100">
      <div v-if="current" class="text-center">
        <p class="text-7xl font-bold">{{ current.queueNo }}</p>
        <p class="text-3xl text-slate-600">{{ current.type }}</p>
        <p v-if="current.staff" class="text-2xl mt-4">
          Counter: <span class="font-semibold">{{ current.staff }}</span>
        </p>
      </div>
      <div v-else class="text-3xl text-slate-400">Waiting…</div>
    </div>
  </Unauthenticated>
</template>
