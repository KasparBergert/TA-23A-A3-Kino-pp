import { computed, ref } from 'vue'
import client from '../utils/api'

export type AuthUser = { email: string; role: string }

const user = ref<AuthUser | null>(null)

const isAuthenticated = computed(() => user.value !== null)
const isAdmin = computed(() => {
  const role = user.value?.role
  return role === 'admin' || role === 'super_admin'
})
const isSuperAdmin = computed(() => user.value?.role === 'super_admin')
const displayName = computed(() => user.value?.email ?? '')

async function loadUser() {
  try {
    const result = await client.get<AuthUser>('/auth/me')
    if (result?.email) user.value = result as AuthUser
  } catch (e) {
    console.error(e)
  }
}

async function logout() {
  try {
    await client.post('/auth/logout', {})
  } finally {
    user.value = null
  }
}

export default {
  user,
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
  displayName,
  loadUser,
  logout,
}
