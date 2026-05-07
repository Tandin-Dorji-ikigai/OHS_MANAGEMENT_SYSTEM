import { Bell } from 'lucide-react'
import NotificationBell from '../notifications/NotificationBell'
import SyncIndicator from '../common/SyncIndicator'
import {
    useAuth,
} from '../../hooks/useAuth'

export default function Topbar() {
    const { user } = useAuth()
    const initials =
        user?.fullName
            ?.split(' ')
            .filter(Boolean)
            .map((name) =>
                name[0]?.toUpperCase()
            )
            .join('')
            .slice(0, 2) ?? 'U'

    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">

            <div className="flex h-20 items-center justify-between px-6">

                <div>
                    <h2 className="text-lg font-semibold">
                        Safety Dashboard
                    </h2>

                    <p className="text-sm text-zinc-400">
                        Monitor and manage OHS operations
                    </p>
                </div>

                <div className="flex items-center gap-4">

                    <NotificationBell />
                    <SyncIndicator />
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black font-semibold">
                            {initials}
                        </div>

                        <div>
                            <p className="text-sm font-medium">
                                {user?.fullName ??
                                    'User'}
                            </p>

                            <p className="text-xs text-zinc-400">
                                {user?.roleLabel ??
                                    'Authenticated User'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
