import { Search } from 'lucide-react'

export default function TableSearch() {
    return (
        <div className="relative">

            <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
                type="text"
                placeholder="Search..."
                className="
          h-11 w-full rounded-xl border border-white/10
          bg-white/[0.03] pl-11 pr-4 text-sm text-white
          placeholder:text-zinc-500
          focus:outline-none focus:ring-2 focus:ring-white/10
        "
            />
        </div>
    )
}