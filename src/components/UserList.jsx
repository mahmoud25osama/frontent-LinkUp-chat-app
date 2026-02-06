import { Users, Loader2 } from 'lucide-react'
import { useFriends } from '../hooks/useFriends'
import { useSocket } from '../context/SocketContext'

const UserList = ({ selectedUser, onSelectUser }) => {
    const { data: friends, isLoading, error } = useFriends()
    const { onlineUsers } = useSocket()

    const isUserOnline = (userId) => {
        return onlineUsers.includes(userId)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-red-600">Error loading friends</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900">أصدقائي</h2>
                        <p className="text-xs text-gray-500">
                            {friends?.filter((f) => isUserOnline(f._id))
                                .length || 0}{' '}
                            متصل الآن
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
                {friends && friends.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {friends.map((friend) => {
                            const isOnline = isUserOnline(friend._id)
                            const isSelected = selectedUser?._id === friend._id

                            return (
                                <button
                                    key={friend._id}
                                    onClick={() => onSelectUser(friend)}
                                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition ${
                                        isSelected
                                            ? 'bg-primary-50 border-l-4 border-primary-600'
                                            : ''
                                    }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={friend.avatar}
                                            alt={friend.username}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        {isOnline && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-medium text-gray-900">
                                            {friend.username}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {isOnline ? 'متصل' : 'غير متصل'}
                                        </p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <Users className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 mb-2">
                            لا يوجد أصدقاء حتى الآن
                        </p>
                        <p className="text-sm text-gray-400">
                            ابحث عن مستخدمين وأضفهم كأصدقاء
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserList
