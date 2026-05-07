export default function DataTable({
    columns,
    data,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[900px] border-collapse">

                    <thead className="border-b border-white/10 bg-white/[0.03]">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="
                    px-6 py-4 text-left text-xs font-semibold
                    uppercase tracking-wider text-zinc-400
                  "
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="border-b border-white/5 hover:bg-white/[0.02]"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="px-6 py-5 text-sm text-zinc-300"
                                    >
                                        {column.render
                                            ? column.render(row)
                                            : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}