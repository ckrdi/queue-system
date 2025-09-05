<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div class="flex-1 max-w-sm">
        <Input v-model="searchQuery" placeholder="Search users..." class="max-w-sm" />
      </div>
      <Button @click="openCreateDialog">
        <Plus class="w-4 h-4 mr-2" />
        Add User
      </Button>
    </div>

    <div class="overflow-x-auto border rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Customers Served
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ user.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                user.status == 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ user.status == 'Active' ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.serveNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
              <Button variant="outline" size="sm" @click="editUser(user)">
                Edit
              </Button>
              <Button variant="outline" size="sm" @click="toggleUserStatus(user)"
                :class="user.status == 'Active' ? 'text-red-600' : 'text-green-600'">
                {{ user.status == 'Active' ? 'Deactivate' : 'Activate' }}
              </Button>
              <Button variant="outline" size="sm" @click="openDeleteDialog(user.id)" class="text-red-600">
                Delete
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-4">
      <p>Loading users...</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="text-center py-4 text-red-500">
      {{ error }}
    </div>

    <!-- Empty state -->
    <div v-if="!loading && filteredUsers.length === 0" class="text-center py-4">
      <p>No users found.</p>
    </div>
  </div>

  <!-- Create/Edit Dialog -->
  <Dialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ editingUser ? 'Edit User' : 'Create User' }}</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Name</Label>
          <Input id="name" v-model="userForm.name" required />
        </div>
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input id="email" v-model="userForm.email" type="email" required />
        </div>
        <div v-if="!editingUser" class="space-y-2">
          <Label for="password">Password</Label>
          <Input id="password" v-model="userForm.password" type="password" required />
        </div>
        <div class="space-y-2">
          <Label for="active">Status</Label>
          <select id="active" v-model="userForm.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div class="flex justify-end space-x-2">
          <Button type="button" variant="outline" @click="closeDialog">
            Cancel
          </Button>
          <Button type="submit" :disabled="submitting">
            {{ submitting ? 'Saving...' : 'Save' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>

  <!-- Create/Edit Dialog -->
  <Dialog :open="isDeleteOpen" @update:open="isDeleteOpen = $event">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="deleteUser()" class="space-y-4">
        <div class="flex justify-end space-x-2">
          <Button type="button" variant="outline" @click="closeDialog">
            Cancel
          </Button>
          <Button type="submit" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-vue-next'
import { type User, type CreateUserDto, type UpdateUserDto } from '@/types/User'
import api from '@/api'
import to from 'await-to-js'
import { toast } from 'vue-sonner'

const users = ref<User[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const isDialogOpen = ref(false)
const editingUser = ref<User | null>(null)
const submitting = ref(false)

const isDeleteOpen = ref(false)
const deleting = ref(false)
const userId = ref(null)

const userForm = ref({
  name: '',
  email: '',
  password: '',
  status: 'Active',
})

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const fetchUsers = async () => {
  error.value = ''
  loading.value = true
  const [err, res] = await to(api.get<User[]>('/users'))
  if (err) {
    console.error('Failed to fetch users:', err)
    error.value = 'Failed to fetch users'
    loading.value = false
    return
  }
  users.value = res.data
  loading.value = false
}

const openCreateDialog = () => {
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    password: '',
    status: 'Active',
  }
  isDialogOpen.value = true
}

const editUser = (user: User) => {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    password: '', // Don't populate password for security
    status: user.status,
  }
  isDialogOpen.value = true
}

const openDeleteDialog = (id: any) => {
  isDeleteOpen.value = true
  userId.value = id
}

const closeDialog = () => {
  isDeleteOpen.value = false
  isDialogOpen.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    password: '',
    status: 'Active',
  }
  userId.value = null
}

const handleSubmit = async () => {
  error.value = ''
  submitting.value = true

  if (editingUser.value) {
    const updateData: UpdateUserDto = {
      name: userForm.value.name,
      email: userForm.value.email,
      status: userForm.value.status,
    }

    const [err, res] = await to(api.put<User>(`/users/${editingUser.value.id}`, updateData))
    if (err != null) {
      error.value = 'Failed to update user'
      closeDialog()
      submitting.value = false
      return
    }
  } else {
    const createData: CreateUserDto = {
      name: userForm.value.name,
      email: userForm.value.email,
      password: userForm.value.password,
      status: userForm.value.status,
    }

    const [err, res] = await to(api.post<User>(`/users`, createData))
    if (err != null) {
      error.value = 'Failed to create user'
      closeDialog()
      submitting.value = false
      return
    }
  }

  closeDialog()
  submitting.value = false

  toast('User has been saved')
  await fetchUsers()
}

const toggleUserStatus = async (user: User) => {
  error.value = ''
  const [err, res] = await to(api.patch<User>(`/users/${user.id}/active`, { active: !(user.status == 'Active') }))
  if (err != null) {
    error.value = 'Failed to update user status'
    return
  }

  toast('User status has been updated')
  await fetchUsers()
}

const deleteUser = async () => {
  error.value = ''
  deleting.value = true

  const [err, res] = await to(api.delete<{ message: string }>(`/users/${userId.value}`))
  if (err != null) {
    error.value = 'Failed to delete user'

    closeDialog()
    deleting.value = false
    return
  }

  closeDialog()
  deleting.value = false

  toast('User has been deleted')
  await fetchUsers()
}

onMounted(() => {
  fetchUsers()
})
</script>
