import { useQuery } from '@tanstack/react-query'
import { userAPI } from '../services/userService'

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await userAPI.getUsers()
            return response.data.users
        },
        staleTime: 30000, // 30 seconds
        refetchOnWindowFocus: true,
    })
}

export const useUser = (userId) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            const response = await userAPI.getUserById(userId)
            return response.data.user
        },
        enabled: !!userId,
    })
}
