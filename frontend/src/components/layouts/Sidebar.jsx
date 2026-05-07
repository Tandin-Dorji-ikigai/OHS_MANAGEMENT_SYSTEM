import {
    LogOut,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

import { navigationByRole } from '../../constants/navigation'
import {
    useAuth,
} from '../../hooks/useAuth'
import {
    hasPermission,
    ROLES,
} from '../../utils/permissions'

export default function Sidebar() {
    const { user, logout } = useAuth()
    const role =
        user?.role ?? ROLES.HQ
    const navigationItems =
        navigationByRole[role] ??
        navigationByRole[ROLES.HQ]

    return (
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-white/10 bg-zinc-950 lg:flex lg:flex-col">

            <div className="flex h-20 items-center border-b border-white/10 px-6">
                <h1 className="text-xl font-bold tracking-tight">
                    OHS Platform
                </h1>
            </div>

            <nav className="flex-1 space-y-2 p-4">
                {navigationItems
                    .filter((item) => {
                        if (!item.permission) {
                            return true
                        }

                        return hasPermission(
                            user,
                            item.permission
                        )
                    })
                    .map((item) => {
                    const Icon = item.icon

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                                    isActive
                                        ? 'bg-white text-black'
                                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                )
                            }
                        >
                            <Icon size={18} />

                            {item.name}
                        </NavLink>
                    )
                    })}
            </nav>

            <div className="border-t border-white/10 p-4">
                <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                    <LogOut size={18} />
                    Sign out
                </button>
            </div>
        </aside>
    )
}
