import { Bell } from 'lucide-react'

import { useState } from 'react'

import NotificationDropdown from './NotificationDropdown'

import {
    useNotifications,
} from '../../context/NotificationContext'

export default function NotificationBell() {
    const [open, setOpen] = useState(false)

    const { unreadCount } =
        useNotifications()

    return (
        <div className="relative">

            <button
                onClick={() => setOpen(!open)}
                className="
          relative rounded-xl border border-white/10
          bg-white/[0.03] p-3
          hover:bg-white/[0.05]
        "
            >
                <Bell size={18} />

                {unreadCount > 0 && (
                    <div
                        className="
              absolute -right-1 -top-1 flex h-5 w-5
              items-center justify-center rounded-full
              bg-red-500 text-xs font-semibold
            "
                    >
                        {unreadCount}
                    </div>
                )}
            </button>

            {open && <NotificationDropdown />}
        </div>
    )
}