import {
    Wifi,
    WifiOff,
} from 'lucide-react'

import { useEffect, useState } from 'react'

import networkMonitor from '../../offline/networkMonitor'

export default function SyncIndicator() {
    const [online, setOnline] =
        useState(
            networkMonitor.isOnline()
        )

    useEffect(() => {
        networkMonitor.start()

        networkMonitor.subscribe(
            setOnline
        )
    }, [])

    return (
        <div
            className={`
        flex items-center gap-2 rounded-xl
        px-4 py-2 text-sm font-medium
        ${online
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-red-500/10 text-red-400'
                }
      `}
        >
            {online ? (
                <Wifi size={16} />
            ) : (
                <WifiOff size={16} />
            )}

            {online
                ? 'Online'
                : 'Offline Mode'}
        </div>
    )
}