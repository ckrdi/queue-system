<template>
  <Authenticated>
    <div class="px-4 py-6">
      <h2 class="pl-4 text-2xl font-bold text-gray-900 mb-4">Welcome to Dashboard</h2>
    </div>
    <div class="p-4 gap-4 flex flex-col">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold">Waiting Queues</h2>
        <p class="text-3xl">{{ waitingCount }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold">Active Staff</h2>
        <p class="text-3xl">{{ activeStaff }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold">Top 3 Staff</h2>
        <ul class="mt-2">
          <li v-for="s in topStaff" :key="s.email">
            {{ s.email }} — {{ s.serveNumber }}
          </li>
        </ul>
      </div>
      <div>
        <Button @click="callNext">
          Call Next Queue
        </Button>
      </div>
    </div>
  </Authenticated>
</template>

<script setup lang="ts">
import Authenticated from '@/layouts/Authenticated.vue'
import { onMounted, ref } from 'vue'
import api from '@/api'
import type { User } from '@/types/User'
import type { Queue } from '@/types/Queue'
import { Button } from '@/components/ui/button'

const waitingCount = ref(0)
const activeStaff = ref(0)
const topStaff = ref<{ email: string, serveNumber: number }[]>([])

async function load() {
  const [w, a, t] = await Promise.all([
    api.get<Queue[]>('/queues?status=Waiting').then(r => r.data.length),
    api.get<User[]>('/users').then(r => r.data.filter((u: User) => u.status == 'Active').length),
    api.get<User[]>('/users/top').then(r => r.data),
  ])
  waitingCount.value = w
  activeStaff.value = a
  topStaff.value = t
}

async function callNext() {
  const id = prompt('Enter staff id to call next:')
  if (!id) return
  await api.patch(`/queues/${id}/call`)
  load()
}

onMounted(load)
</script>
