import TableSearch from './TableSearch'

export default function TableHeader({
    title,
    description,
    action,
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
                <h2 className="text-2xl font-bold">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                    {description}
                </p>
            </div>

            <div className="flex gap-3">
                <TableSearch />

                {action}
            </div>
        </div>
    )
}