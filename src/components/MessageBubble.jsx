import { useState } from 'react'
import { Copy, Trash2, Reply, Check } from 'lucide-react'
import { format } from 'date-fns'

const MessageBubble = ({ message, isOwnMessage, onDelete, onReply }) => {
    const [showActions, setShowActions] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy:', error)
        }
    }

    const handleDelete = () => {
        if (window.confirm('هل تريد حذف هذه الرسالة؟')) {
            onDelete(message._id)
        }
    }

    return (
        <div
            className={`group flex ${
                isOwnMessage ? 'justify-start' : 'justify-end'
            } mb-2 overflow-hidden`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div
                className={`flex items-start gap-2 max-w-xs lg:max-w-md ${
                    isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                }`}
            >
                {/* Message Bubble */}
                <div className="relative">
                    <div
                        className={`message-bubble px-4 py-2 rounded-2xl ${
                            isOwnMessage
                                ? 'bg-primary-600 text-white rounded-br-sm'
                                : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                        }`}
                    >
                        {/* Reply Preview */}
                        {message.replyTo && (
                            <div
                                className={`mb-2 pb-2 border-b ${
                                    isOwnMessage
                                        ? 'border-primary-400'
                                        : 'border-gray-200'
                                } text-sm opacity-75`}
                            >
                                <div className="flex items-center gap-1 mb-1">
                                    <Reply className="w-3 h-3" />
                                    <span className="font-medium text-xs">
                                        {message.replyTo.sender?.username}
                                    </span>
                                </div>
                                <p className="truncate text-xs">
                                    {message.replyTo.content}
                                </p>
                            </div>
                        )}

                        {/* Message Content */}
                        <p className="break-all whitespace-pre-wrap">
                            {message.content}
                        </p>

                        {/* Timestamp */}
                        <p
                            className={`text-xs mt-1 ${
                                isOwnMessage
                                    ? 'text-primary-100'
                                    : 'text-gray-400'
                            }`}
                        >
                            {format(new Date(message.createdAt), 'HH:mm')}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    {showActions && (
                        <div
                            className={`absolute top-0 flex gap-1 ${
                                isOwnMessage
                                    ? 'right-full mr-2'
                                    : 'left-full ml-2'
                            }`}
                        >
                            {/* Copy */}
                            <button
                                onClick={handleCopy}
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition text-gray-600"
                                title="نسخ"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>

                            {/* Reply */}
                            <button
                                onClick={() => onReply(message)}
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition text-gray-600"
                                title="رد"
                            >
                                <Reply className="w-4 h-4" />
                            </button>

                            {/* Delete - Only show for own messages */}
                            {isOwnMessage && (
                                <button
                                    onClick={handleDelete}
                                    className="p-1.5 bg-red-100 hover:bg-red-200 rounded-full transition text-red-600"
                                    title="حذف"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MessageBubble
