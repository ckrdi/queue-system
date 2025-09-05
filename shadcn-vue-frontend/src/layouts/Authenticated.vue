<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <Toaster />
  <SidebarProvider>
    <AppSidebar />
    <main class="flex-1">
      <SidebarTrigger />
      <slot />
    </main>
  </SidebarProvider>
</template>
