<script setup lang="ts">
import { Home, LogOut, User } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"

// Menu items.
const items = [
  {
    title: "Home",
    name: "home",
    url: "/",
    icon: Home,
  },
  {
    title: "Users",
    name: "users",
    url: "/users",
    icon: User,
  },
  {
    title: "Log out",
    name: "logout",
    url: "#",
    icon: LogOut,
  }
]

const handleClick = (name: string) => {
  if (name != 'logout') return

  const authStore = useAuthStore()
  const router = useRouter()
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton asChild>
                    <a :href="item.url" @click="handleClick(item.name)">
                      <component :is="item.icon" />
                      <span>{{item.title}}</span>
                    </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
