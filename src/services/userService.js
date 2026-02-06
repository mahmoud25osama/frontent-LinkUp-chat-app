import api from './api'

export const userAPI = {
    getUsers: async () => {
        const response = await api.get('/users')
        return response.data
    },

    getUserById: async (userId) => {
        const response = await api.get(`/users/${userId}`)
        return response.data
    },
}
