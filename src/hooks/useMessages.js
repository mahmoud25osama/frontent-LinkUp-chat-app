import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messageAPI } from '../services/messageService'

export const useConversation = (userId) => {
    return useQuery({
        queryKey: ['conversation', userId],
        queryFn: async () => {
            const response = await messageAPI.getConversation(userId)
            return response.data.messages
        },
        enabled: !!userId,
        staleTime: 0, // Always refetch to ensure fresh data
    })
}

export const useMarkAsRead = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userId) => messageAPI.markAsRead(userId),
        onSuccess: () => {
            // Invalidate conversations to refetch with updated read status
            queryClient.invalidateQueries({ queryKey: ['conversation'] })
        },
    })
}

export const useDeleteMessage = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (messageId) => messageAPI.deleteMessage(messageId),
        onSuccess: (data, messageId) => {
            // Optimistically update the UI
            queryClient.setQueriesData(
                { queryKey: ['conversation'] },
                (old) => {
                    if (!old) return old
                    return old.filter((msg) => msg._id !== messageId)
                }
            )
        },
    })
}
