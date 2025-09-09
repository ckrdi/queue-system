<template>
  <Unauthenticated>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle class="text-2xl text-center">Queue</CardTitle>
          <CardDescription class="text-center">
            Create queue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QueueForm @success="handleSuccess" />
        </CardContent>
      </Card>
    </div>
  </Unauthenticated>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Unauthenticated from '@/layouts/Unauthenticated.vue'
import QueueForm from '@/components/QueueForm.vue'
import { toast } from 'vue-sonner'
const handleSuccess = () => { toast('Queue created') }
</script>
