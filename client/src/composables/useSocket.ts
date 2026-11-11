import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || undefined
let socket: Socket | null = null

export function useSocket() {
  const currentId = ref<string | null>(null)
  const isSyncMode = ref(true)
  const localId = ref<string | null>(null)

  const connect = () => {
    if (!socket) {
      socket = io(SOCKET_URL)
      
      socket.on('connect', () => {
        console.log('Connected to server')
        // Automatically request latest state if needed, though server sends on connect
      })

      socket.on('sync', (data: { currentId: string }) => {
        currentId.value = data.currentId
        if (isSyncMode.value) {
          localId.value = data.currentId
        }
      })
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  }

  const setSyncMode = (mode: boolean) => {
    isSyncMode.value = mode
    if (mode && currentId.value !== null) {
      localId.value = currentId.value
    }
  }

  const sendAdminUpdate = (id: string) => {
    if (socket) {
      socket.emit('admin:update', { id })
    }
  }

  return {
    socket,
    currentId,
    isSyncMode,
    localId,
    connect,
    disconnect,
    setSyncMode,
    sendAdminUpdate
  }
}
