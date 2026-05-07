class SocketService {
    connect() {
        console.log('Socket connected')
    }

    disconnect() {
        console.log('Socket disconnected')
    }

    subscribe(event, callback) {
        console.log(`Subscribed to ${event}`)
    }

    emit(event, data) {
        console.log(event, data)
    }
}

export default new SocketService()