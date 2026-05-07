export function unwrapResponse(response) {
    return response.data?.data ?? response.data ?? null
}

export function unwrapPaginatedResponse(
    response
) {
    return {
        data:
            response.data?.data ?? [],
        pagination:
            response.data?.pagination ??
            null,
    }
}

export function getErrorMessage(error) {
    return (
        error?.response?.data?.message ??
        error?.message ??
        'Something went wrong.'
    )
}
