import { useState } from 'react'
import { Search, UserPlus, Loader2, Check, Clock, X } from 'lucide-react'
import { useSearchUsers, useSendFriendRequest } from '../hooks/useFriends'

const UserSearch = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')

    const { data: users, isLoading } = useSearchUsers(debouncedQuery)
    const sendRequest = useSendFriendRequest()

    // Debounce search
    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchQuery(value)

        // Debounce the actual search
        setTimeout(() => {
            setDebouncedQuery(value)
        }, 500)
    }

    const handleSendRequest = async (userId) => {
        try {
            await sendRequest.mutateAsync(userId)
        } catch (error) {
            console.error('Error sending friend request:', error)
        }
    }

    const getStatusButton = (user) => {
        if (user.friendshipStatus === 'friends') {
            return (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    <Check className="w-4 h-4" />
                    <span>صديق</span>
                </div>
            )
        } else if (user.friendshipStatus === 'pending') {
            return (
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    <Clock className="w-4 h-4" />
                    <span>قيد الانتظار</span>
                </div>
            )
        } else {
            return (
                <button
                    onClick={() => handleSendRequest(user._id)}
                    disabled={sendRequest.isPending}
                    className="flex items-center gap-1 px-3 py-1 bg-primary-600 text-white rounded-full text-sm hover:bg-primary-700 transition disabled:opacity-50"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>إضافة</span>
                </button>
            )
        }
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Search Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    البحث عن أصدقاء
                </h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="ابحث باسم المستخدم أو البريد الإلكتروني..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                    </div>
                ) : users && users.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <div
                                key={user._id}
                                className="p-4 flex items-center gap-3 hover:bg-gray-50"
                            >
                                <img
                                    src={user.avatar}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">
                                        {user.username}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                </div>
                                {getStatusButton(user)}
                            </div>
                        ))}
                    </div>
                ) : searchQuery.trim().length > 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500">لا توجد نتائج</p>
                        <p className="text-sm text-gray-400 mt-1">
                            جرب البحث بكلمات مختلفة
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500">ابدأ البحث</p>
                        <p className="text-sm text-gray-400 mt-1">
                            اكتب اسم المستخدم أو البريد الإلكتروني
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserSearch
