import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { friendAPI } from '../services/FriendService.js'

// Get user's friends
export const useFriends = () => {
    return useQuery({
        queryKey: ['friends'],
        queryFn: async () => {
            const response = await friendAPI.getFriends()
            return response.data.friends
        },
        staleTime: 30000,
    })
}

// Search users
export const useSearchUsers = (query) => {
    return useQuery({
        queryKey: ['searchUsers', query],
        queryFn: async () => {
            if (!query || query.trim().length === 0) {
                return []
            }
            const response = await friendAPI.searchUsers(query)
            return response.data.users
        },
        enabled: !!query && query.trim().length > 0,
    })
}

// Get pending friend requests
export const usePendingRequests = () => {
    return useQuery({
        queryKey: ['pendingRequests'],
        queryFn: async () => {
            const response = await friendAPI.getPendingRequests()
            return response.data.requests
        },
        refetchInterval: 10000, // Refetch every 10 seconds
    })
}

// Send friend request
export const useSendFriendRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userId) => friendAPI.sendFriendRequest(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['searchUsers'] })
            queryClient.invalidateQueries({ queryKey: ['pendingRequests'] })
        },
    })
}

// Accept friend request
export const useAcceptFriendRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (requestId) => friendAPI.acceptFriendRequest(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friends'] })
            queryClient.invalidateQueries({ queryKey: ['pendingRequests'] })
        },
    })
}

// Reject friend request
export const useRejectFriendRequest = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (requestId) => friendAPI.rejectFriendRequest(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingRequests'] })
        },
    })
}

// Remove friend
export const useRemoveFriend = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userId) => friendAPI.removeFriend(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friends'] })
        },
    })
}
