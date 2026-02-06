import api from './api'

export const friendAPI = {
    // Get user's friends
    getFriends: async () => {
        const response = await api.get('/friends')
        return response.data
    },

    // Search for users
    searchUsers: async (query) => {
        const response = await api.get(
            `/friends/search?q=${encodeURIComponent(query)}`
        )
        return response.data
    },

    // Get pending friend requests
    getPendingRequests: async () => {
        const response = await api.get('/friends/requests/pending')
        return response.data
    },

    // Send friend request
    sendFriendRequest: async (userId) => {
        const response = await api.post(`/friends/request/${userId}`)
        return response.data
    },

    // Accept friend request
    acceptFriendRequest: async (requestId) => {
        const response = await api.put(`/friends/accept/${requestId}`)
        return response.data
    },

    // Reject friend request
    rejectFriendRequest: async (requestId) => {
        const response = await api.put(`/friends/reject/${requestId}`)
        return response.data
    },

    // Remove friend
    removeFriend: async (userId) => {
        const response = await api.delete(`/friends/${userId}`)
        return response.data
    },
}
