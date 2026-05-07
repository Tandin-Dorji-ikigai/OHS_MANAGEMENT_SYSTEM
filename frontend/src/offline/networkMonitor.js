class NetworkMonitor {
    constructor() {
        this.listeners = []
    }

    start() {
        window.addEventListener(
            'online',
            () => {
                this.notify(true)
            }
        )

        window.addEventListener(
            'offline',
            () => {
                this.notify(false)
            }
        )
    }

    subscribe(callback) {
        this.listeners.push(callback)
    }

    notify(status) {
        this.listeners.forEach((listener) =>
            listener(status)
        )
    }

    isOnline() {
        return navigator.onLine
    }
}

export default new NetworkMonitor()