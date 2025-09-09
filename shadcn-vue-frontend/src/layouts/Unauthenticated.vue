<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <Toaster />
  <main class="flex-1">
    <slot />
  </main>
</template>
