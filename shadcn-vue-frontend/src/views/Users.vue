<template>
  <Authenticated>
    <div class="px-4 py-6 sm:px-0">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Users Management</h3>
        <UsersTable />
      </div>
    </div>
  </Authenticated>
</template>

<script setup lang="ts">
import Authenticated from '@/layouts/Authenticated.vue'
import UsersTable from '@/components/UsersTable.vue'
</script>
