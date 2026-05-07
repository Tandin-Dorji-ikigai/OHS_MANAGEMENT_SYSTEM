const QUEUE_KEY = 'ohs_offline_queue'

function setQueue(queue) {
    localStorage.setItem(
        QUEUE_KEY,
        JSON.stringify(queue)
    )
}

export function addToQueue(item) {
    const queue = getQueue()

    queue.push({
        ...item,
        queuedAt: new Date(),
        retryCount: 0,
    })

    setQueue(queue)
}

export function getQueue() {
    const queue =
        localStorage.getItem(QUEUE_KEY)

    return queue ? JSON.parse(queue) : []
}

export function clearQueue() {
    localStorage.removeItem(QUEUE_KEY)
}

export function removeFromQueue(index) {
    const queue = getQueue()
    queue.splice(index, 1)
    setQueue(queue)
}
