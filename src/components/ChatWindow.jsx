import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, ArrowLeft, X } from 'lucide-react'
import { useConversation, useDeleteMessage } from '../hooks/useMessages'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import MessageBubble from './MessageBubble'

const ChatWindow = ({ selectedUser, onBack }) => {
    const { user: currentUser } = useAuth()
    const { socket, onlineUsers } = useSocket()
    const queryClient = useQueryClient()
    const messagesEndRef = useRef(null)
    const [message, setMessage] = useState('')
    const [typing, setTyping] = useState(false)
    const [replyingTo, setReplyingTo] = useState(null)
    const typingTimeoutRef = useRef(null)

    const { data: messages, isLoading } = useConversation(selectedUser?._id)
    const deleteMessage = useDeleteMessage()

    const isUserOnline = onlineUsers.includes(selectedUser?._id)

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Socket event listeners
    useEffect(() => {
        if (!socket) return

        const handleReceiveMessage = (newMessage) => {
            if (
                newMessage.sender._id === selectedUser?._id ||
                newMessage.recipient._id === selectedUser?._id
            ) {
                queryClient.setQueryData(
                    ['conversation', selectedUser._id],
                    (old) => [...(old || []), newMessage]
                )
            }
        }

        const handleMessageSent = (sentMessage) => {
            queryClient.setQueryData(
                ['conversation', selectedUser._id],
                (old) => [...(old || []), sentMessage]
            )
        }

        const handleUserTyping = ({ userId }) => {
            if (userId === selectedUser?._id) {
                setTyping(true)
            }
        }

        const handleUserStopTyping = ({ userId }) => {
            if (userId === selectedUser?._id) {
                setTyping(false)
            }
        }

        socket.on('receive-message', handleReceiveMessage)
        socket.on('message-sent', handleMessageSent)
        socket.on('user-typing', handleUserTyping)
        socket.on('user-stop-typing', handleUserStopTyping)

        return () => {
            socket.off('receive-message', handleReceiveMessage)
            socket.off('message-sent', handleMessageSent)
            socket.off('user-typing', handleUserTyping)
            socket.off('user-stop-typing', handleUserStopTyping)
        }
    }, [socket, selectedUser, queryClient])

    const handleSendMessage = (e) => {
        e.preventDefault()

        if (!message.trim() || !socket || !selectedUser) return

        const messageData = {
            recipientId: selectedUser._id,
            content: message.trim(),
        }

        if (replyingTo) {
            messageData.replyTo = replyingTo._id
        }

        socket.emit('send-message', messageData)

        setMessage('')
        setReplyingTo(null)
        socket.emit('stop-typing', { recipientId: selectedUser._id })
    }

    const handleTyping = (e) => {
        setMessage(e.target.value)

        if (!socket || !selectedUser) return

        socket.emit('typing', { recipientId: selectedUser._id })

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop-typing', { recipientId: selectedUser._id })
        }, 1000)
    }

    const handleDeleteMessage = async (messageId) => {
        try {
            await deleteMessage.mutateAsync(messageId)
        } catch (error) {
            console.error('Error deleting message:', error)
        }
    }

    const handleReplyToMessage = (msg) => {
        setReplyingTo(msg)
    }

    const cancelReply = () => {
        setReplyingTo(null)
    }

    if (!selectedUser) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-10 h-10 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        اختر محادثة
                    </h3>
                    <p className="text-gray-500">
                        اختر صديق من القائمة لبدء المحادثة
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative flex-shrink-0">
                    <img
                        src={selectedUser.avatar}
                        alt={selectedUser.username}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    {isUserOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <div>
                    <h2 className="font-semibold text-gray-900">
                        {selectedUser.username}
                    </h2>
                    <p className="text-xs text-gray-500">
                        {isUserOnline ? 'متصل' : 'غير متصل'}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 scrollbar-thin">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                    </div>
                ) : messages && messages.length > 0 ? (
                    <>
                        {messages.map((msg) => {
                            const isOwnMessage =
                                msg.sender._id === currentUser.id
                            return (
                                <MessageBubble
                                    key={msg._id}
                                    message={msg}
                                    isOwnMessage={isOwnMessage}
                                    onDelete={handleDeleteMessage}
                                    onReply={handleReplyToMessage}
                                />
                            )
                        })}
                        {typing && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-900 rounded-2xl rounded-bl-sm shadow-sm px-4 py-2">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                            لا توجد رسائل. ابدأ المحادثة!
                        </p>
                    </div>
                )}
            </div>

            {/* Reply Preview */}
            {replyingTo && (
                <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-xs text-gray-600 font-medium">
                            الرد على {replyingTo.sender.username}
                        </p>
                        <p className="text-sm text-gray-800 truncate">
                            {replyingTo.content.length > 50 ? '...' : ''}
                            {replyingTo.content.slice(0, 50)}
                        </p>
                    </div>
                    <button
                        onClick={cancelReply}
                        className="p-1 hover:bg-gray-200 rounded-full"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={handleTyping}
                        placeholder="اكتب رسالة..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        dir="auto"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatWindow
