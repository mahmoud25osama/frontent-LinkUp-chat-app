import { UserPlus, Loader2, Check, X } from 'lucide-react'
import {
    usePendingRequests,
    useAcceptFriendRequest,
    useRejectFriendRequest,
} from '../hooks/useFriends'

const FriendRequests = () => {
    const { data: requests, isLoading } = usePendingRequests()
    const acceptRequest = useAcceptFriendRequest()
    const rejectRequest = useRejectFriendRequest()

    const handleAccept = async (requestId) => {
        try {
            await acceptRequest.mutateAsync(requestId)
        } catch (error) {
            console.error('Error accepting request:', error)
        }
    }

    const handleReject = async (requestId) => {
        try {
            await rejectRequest.mutateAsync(requestId)
        } catch (error) {
            console.error('Error rejecting request:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            طلبات الصداقة
                        </h2>
                        {requests && requests.length > 0 && (
                            <p className="text-xs text-gray-500">
                                {requests.length} طلب جديد
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Requests List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
                {requests && requests.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {requests.map((request) => (
                            <div key={request._id} className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={request.sender.avatar}
                                        alt={request.sender.username}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">
                                            {request.sender.username}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {new Date(
                                                request.createdAt
                                            ).toLocaleDateString('ar-EG', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleAccept(request._id)
                                        }
                                        disabled={acceptRequest.isPending}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>قبول</span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleReject(request._id)
                                        }
                                        disabled={rejectRequest.isPending}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>رفض</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <UserPlus className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500">لا توجد طلبات صداقة</p>
                        <p className="text-sm text-gray-400 mt-1">
                            ستظهر هنا عند وصول طلبات جديدة
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FriendRequests
