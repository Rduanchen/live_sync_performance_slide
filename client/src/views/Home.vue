<template>
  <v-container class="pa-0 d-flex flex-column fill-height" fluid style="min-height: 100dvh;">
    <v-tabs v-model="tab" background-color="surface" grow class="flex-grow-0 w-100" style="position: sticky; top: 0; z-index: 100;">
      <v-tab value="landing">主頁</v-tab>
      <v-tab value="program">節目表</v-tab>
      <v-tab value="sync">現在演出</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="flex-grow-1 w-100 h-100">
      <!-- Landing View -->
      <v-window-item value="landing" class="h-100 pa-6 d-flex flex-column align-center bg-background">
        <div class="d-flex flex-column justify-center align-center flex-grow-1 w-100 text-center">
          <v-icon size="100" color="primary" class="mb-6">mdi-music-clef-treble</v-icon>
          <h1 class="text-h3 font-weight-bold mb-4 text-primary" style="line-height: 1.2;">要不要和我"雀"認關係</h1>
          <h2 class="text-h5 mb-10 text-grey-lighten-1">雀兒輕音社期末公演</h2>
          
          <v-btn
            color="primary"
            size="x-large"
            class="mb-6 w-100 rounded-pill"
            max-width="320"
            elevation="4"
            prepend-icon="mdi-broadcast"
            @click="tab = 'sync'"
          >
            即時節目資訊
          </v-btn>
          
          <v-btn
            color="secondary"
            size="large"
            variant="outlined"
            class="mb-6 w-100 rounded-pill"
            max-width="320"
            prepend-icon="mdi-image"
            @click="tab = 'program'"
          >
            節目表圖檔
          </v-btn>

          <v-btn
            color="#E1306C"
            size="large"
            variant="tonal"
            class="w-100 rounded-pill"
            max-width="320"
            prepend-icon="mdi-instagram"
            href="https://instagram.com"
            target="_blank"
          >
            社團 IG 連結
          </v-btn>
        </div>

        <div class="text-caption text-grey mt-4 w-100 text-center">
          Designed by 阿端 |
          <a href="https://github.com/Rduanchen" target="_blank" class="text-secondary text-decoration-none d-inline-flex align-center">
            <v-icon size="small" class="mr-1">mdi-github</v-icon>  @Rduanchen
          </a>
        </div>
      </v-window-item>

      <!-- Program List View -->
      <v-window-item value="program" class="h-100 pa-4 overflow-y-auto">
        <v-row>
          <v-col v-for="item in program" :key="item.id" cols="12">
            <v-card class="mb-4 bg-surface">
              <v-img v-if="item.slideURL" :src="getImgUrl(item.slideURL)" height="200" cover></v-img>
              <v-card-title>{{ item.title }}</v-card-title>
              <v-card-subtitle v-if="item.groupName">{{ item.groupName }}</v-card-subtitle>
              <v-card-text>{{ item.message }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Sync View -->
      <v-window-item value="sync" class="h-100">
        <div class="sync-container h-100 position-relative">
          <v-carousel
            v-model="carouselIndex"
            hide-delimiters
            :show-arrows="false"
            height="100%"
            class="h-100"
            @update:modelValue="onCarouselChange"
          >
            <v-carousel-item v-for="(item, index) in program" :key="item.id" :value="index">
              <!-- Type A: Performance -->
              <div v-if="item.type === 'performance'" class="d-flex flex-column h-100">
                <v-img :src="getImgUrl(item.slideURL)" class="flex-grow-0" style="aspect-ratio: 16/9;" cover></v-img>
                <div class="flex-grow-1 py-4 px-8 px-sm-12 overflow-y-auto bg-background">
                  <h2 class="text-h4 font-weight-bold mb-2">{{ item.title }}</h2>
                  <h3 class="text-h6 text-primary mb-4" v-if="item.groupName">{{ item.groupName }}</h3>
                  <p class="text-body-1 mb-6">{{ item.message }}</p>
                  
                  <v-divider class="mb-4"></v-divider>
                  
                  <div v-if="item.members && item.members.length > 0">
                    <h4 class="text-h6 mb-3">演出成員</h4>
                    <v-list class="bg-transparent pa-0">
                      <v-list-item v-for="(member, mIdx) in item.members" :key="mIdx" class="px-0 mb-2">
                        <template v-slot:prepend>
                          <v-avatar size="48">
                            <v-img :src="getImgUrl(member.imgUrl)" cover></v-img>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="text-h6">{{ member.name }}</v-list-item-title>
                        <template v-slot:append>
                          <v-btn icon="mdi-instagram" variant="text" color="primary" :href="member.ig" target="_blank" class="position-relative" style="z-index: 10;"></v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>
                </div>
              </div>

              <!-- Type B: Message -->
              <div v-else-if="item.type === 'message'" class="d-flex flex-column justify-center align-center h-100 pa-6 text-center bg-background">
                <h2 class="text-h2 font-weight-bold mb-6 text-primary">{{ item.title }}</h2>
                <p class="text-h5">{{ item.message }}</p>
              </div>
            </v-carousel-item>
          </v-carousel>

          <!-- Navigation Overlays for swipe/click (desktop fallback) -->
          <div class="nav-overlay left" @click="prevSlide">
            <v-icon size="large">mdi-chevron-left</v-icon>
          </div>
          <div class="nav-overlay right" @click="nextSlide">
            <v-icon size="large">mdi-chevron-right</v-icon>
          </div>

          <!-- Sync Now Button -->
          <v-btn
            v-if="!isSyncMode"
            color="primary"
            class="sync-fab position-absolute"
            style="bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 10;"
            rounded="pill"
            elevation="8"
            @click="restoreSync"
            prepend-icon="mdi-sync"
          >
            回到同步
          </v-btn>
        </div>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useSocket } from '../composables/useSocket'
import type { ProgramSlide } from '../types/program'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const tab = ref('landing')
const program = ref<ProgramSlide[]>([])
const carouselIndex = ref(0)
let wakeLock: WakeLockSentinel | null = null

const { connect, disconnect, isSyncMode, localId, setSyncMode } = useSocket()

const getImgUrl = (url?: string) => {
  if (!url) return ''
  return url.startsWith('http') ? url : SOCKET_URL + url
}

// Fetch program data and preload images
const fetchProgram = async () => {
  try {
    const res = await fetch(`${SOCKET_URL}/api/program`)
    const data = await res.json()
    program.value = data

    // Preload images
    data.forEach((item: ProgramSlide) => {
      if (item.slideURL) {
        const img = new Image()
        img.src = getImgUrl(item.slideURL)
      }
      if (item.members) {
        item.members.forEach(m => {
          if (m.imgUrl) {
            const img = new Image()
            img.src = getImgUrl(m.imgUrl)
          }
        })
      }
    })
  } catch (e) {
    console.error('Error fetching program:', e)
  }
}

// Wake Lock API
const requestWakeLock = async () => {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen')
    }
  } catch (err) {
    console.warn(`Wake Lock error: ${err}`)
  }
}

const releaseWakeLock = () => {
  if (wakeLock !== null) {
    wakeLock.release()
    wakeLock = null
  }
}

// Syncing logic
watch(localId, (newId) => {
  if (isSyncMode.value && newId) {
    const idx = program.value.findIndex(p => p.id === newId)
    if (idx !== -1) {
      carouselIndex.value = idx
    }
  }
})

const onCarouselChange = (newVal: number) => {
  // If carousel changes not by sync but by user interaction, break sync
  const currentItem = program.value[newVal]
  if (currentItem && currentItem.id !== localId.value) {
    setSyncMode(false)
  }
}

const prevSlide = () => {
  if (carouselIndex.value > 0) {
    setSyncMode(false)
    carouselIndex.value--
  }
}

const nextSlide = () => {
  if (carouselIndex.value < program.value.length - 1) {
    setSyncMode(false)
    carouselIndex.value++
  }
}

const restoreSync = () => {
  setSyncMode(true)
}

// Handle tab visibility for Wake Lock
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && tab.value === 'sync') {
    requestWakeLock()
  } else {
    releaseWakeLock()
  }
}

watch(tab, (newTab) => {
  if (newTab === 'sync') {
    requestWakeLock()
  } else {
    releaseWakeLock()
  }
})

onMounted(async () => {
  await fetchProgram()
  connect()
  requestWakeLock()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  disconnect()
  releaseWakeLock()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.sync-container {
  overflow: hidden;
}

.nav-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 10%;
  max-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  opacity: 0;
  transition: opacity 0.3s;
}

.nav-overlay:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.05);
}

.nav-overlay.left {
  left: 0;
}

.nav-overlay.right {
  right: 0;
}
</style>
