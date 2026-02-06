import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    const { token, isAuthenticated } = useAuth()

    useEffect(() => {
        if (isAuthenticated && token) {
            // Create socket connection
            const newSocket = io(SOCKET_URL, {
                auth: {
                    token,
                },
            })

            newSocket.on('connect', () => {
                console.log('✅ Socket connected')
                setIsConnected(true)
            })

            newSocket.on('disconnect', () => {
                console.log('❌ Socket disconnected')
                setIsConnected(false)
            })

            newSocket.on('online-users', (users) => {
                setOnlineUsers(users)
            })

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error.message)
                setIsConnected(false)
            })

            setSocket(newSocket)

            // Cleanup on unmount or auth change
            return () => {
                newSocket.close()
            }
        } else {
            // Disconnect socket if user logs out
            if (socket) {
                socket.close()
                setSocket(null)
                setIsConnected(false)
                setOnlineUsers([])
            }
        }
    }, [isAuthenticated, token])

    const value = {
        socket,
        onlineUsers,
        isConnected,
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context
}
