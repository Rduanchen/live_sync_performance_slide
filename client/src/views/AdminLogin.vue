<template>
  <v-container class="fill-height bg-background">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 pa-4 bg-surface">
          <v-card-title class="text-h5 text-center mb-4">Admin Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin" v-model="isValid">
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                prepend-icon="mdi-lock"
                :rules="[v => !!v || 'Password is required']"
                required
                variant="outlined"
              ></v-text-field>
              
              <v-alert
                v-if="errorMsg"
                type="error"
                variant="tonal"
                class="mt-3"
                density="compact"
              >{{ errorMsg }}</v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                class="mt-6"
                size="large"
                :loading="loading"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const router = useRouter()

const password = ref('')
const isValid = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  if (!isValid.value) return
  
  loading.value = true
  errorMsg.value = ''
  
  try {
    const res = await fetch(`${SOCKET_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: password.value })
    })
    
    const data = await res.json()
    
    if (data.success) {
      localStorage.setItem('adminToken', data.token)
      router.push('/admin-panel')
    } else {
      errorMsg.value = data.message || 'Login failed'
    }
  } catch (err) {
    errorMsg.value = 'Connection error'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
