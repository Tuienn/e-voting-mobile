import { SOCKET_BASE_URL } from '@/constants/env.config'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(SOCKET_BASE_URL, {
            transports: ['websocket']
        })
    }
    return socket
}
