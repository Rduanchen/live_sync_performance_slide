<template>
  <v-container class="bg-background fill-height d-flex flex-column" fluid>
    <v-app-bar color="surface" elevation="2">
      <v-app-bar-title>Admin Panel - Live Control</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn color="error" variant="text" @click="logout" prepend-icon="mdi-logout">Logout</v-btn>
    </v-app-bar>

    <div class="flex-grow-1 w-100 d-flex flex-column align-center pa-4 py-sm-8">
      <div v-if="program.length === 0" class="mt-10">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else class="w-100 text-center" style="max-width: 600px;">
        <h2 class="text-h5 text-sm-h4 mb-4">Currently Showing</h2>
        
        <v-card class="bg-surface pa-4 mb-6">
          <v-card-title class="text-primary text-h5 font-weight-bold">
            {{ currentSlide?.title }}
          </v-card-title>
          <v-card-subtitle v-if="currentSlide?.groupName">
            {{ currentSlide.groupName }}
          </v-card-subtitle>
          <v-card-text>
            <p>{{ currentSlide?.message }}</p>
          </v-card-text>
        </v-card>

        <div class="d-flex justify-space-between align-center mb-2">
          <v-btn 
            size="large" 
            color="secondary" 
            :disabled="currentIndex <= 0"
            @click="prevSlide"
            prepend-icon="mdi-chevron-left"
            class="px-2 px-sm-4"
          >
            <span class="d-none d-sm-inline">Prev</span>
          </v-btn>
          
          <div class="text-subtitle-1 text-sm-h6 font-weight-bold px-2">
            {{ currentIndex + 1 }} / {{ program.length }}
          </div>

          <v-btn 
            size="large" 
            color="primary" 
            :disabled="currentIndex >= program.length - 1"
            @click="nextSlide"
            append-icon="mdi-chevron-right"
            class="px-2 px-sm-4"
          >
            <span class="d-none d-sm-inline">Next</span>
          </v-btn>
        </div>
        
        <v-divider class="my-4"></v-divider>
        
        <!-- Quick Jump List -->
        <h3 class="text-subtitle-1 text-sm-h6 mb-3 text-left">Quick Jump</h3>
        <v-list class="bg-surface rounded-lg text-left overflow-y-auto" style="max-height: 40vh;">
          <v-list-item 
            v-for="(item, index) in program" 
            :key="item.id"
            :active="index === currentIndex"
            @click="jumpToSlide(index)"
            color="primary"
          >
            <v-list-item-title class="text-body-2 text-sm-body-1">{{ index + 1 }}. {{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSocket } from '../composables/useSocket'
import type { ProgramSlide } from '../types/program'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const router = useRouter()
const { connect, disconnect, currentId, sendAdminUpdate } = useSocket()

const program = ref<ProgramSlide[]>([])

const currentIndex = computed(() => {
  if (!currentId.value) return 0
  const idx = program.value.findIndex(p => p.id === currentId.value)
  return idx !== -1 ? idx : 0
})

const currentSlide = computed(() => {
  if (program.value.length === 0) return null
  return program.value[currentIndex.value]
})

const fetchProgram = async () => {
  try {
    const res = await fetch(`${SOCKET_URL}/api/program`)
    program.value = await res.json()
  } catch (e) {
    console.error('Error fetching program:', e)
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    const newId = program.value[currentIndex.value - 1].id
    sendAdminUpdate(newId)
  }
}

const nextSlide = () => {
  if (currentIndex.value < program.value.length - 1) {
    const newId = program.value[currentIndex.value + 1].id
    sendAdminUpdate(newId)
  }
}

const jumpToSlide = (index: number) => {
  const newId = program.value[index].id
  sendAdminUpdate(newId)
}

const logout = () => {
  localStorage.removeItem('adminToken')
  router.push('/admin-login')
}

onMounted(async () => {
  await fetchProgram()
  connect()
})

onUnmounted(() => {
  disconnect()
})
</script>
