import {
    QueryClient,
} from '@tanstack/react-query'

const queryClient =
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: 2,
                staleTime: 30 * 1000,
                refetchOnWindowFocus: false,
            },
        },
    })

export default queryClient
