import api from './api'

export const messageAPI = {
    getConversation: async (userId) => {
        const response = await api.get(`/messages/${userId}`)
        return response.data
    },

    markAsRead: async (userId) => {
        const response = await api.put(`/messages/read/${userId}`)
        return response.data
    },

    deleteMessage: async (messageId) => {
        const response = await api.delete(`/messages/${messageId}`)
        return response.data
    },
}
