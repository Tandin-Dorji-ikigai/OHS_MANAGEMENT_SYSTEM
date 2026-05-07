export async function retryOperation(
    operation,
    retries = 3
) {
    for (
        let attempt = 1;
        attempt <= retries;
        attempt++
    ) {
        try {
            return await operation()
        } catch (error) {
            console.error(
                `Retry ${attempt} failed`
            )

            if (attempt === retries) {
                throw error
            }

            await new Promise((resolve) =>
                setTimeout(resolve, 2000)
            )
        }
    }
}