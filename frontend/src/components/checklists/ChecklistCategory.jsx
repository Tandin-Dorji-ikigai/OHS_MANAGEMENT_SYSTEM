import ChecklistItem from './ChecklistItem'

export default function ChecklistCategory({
    category,
    onItemChange,
    values = {},
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">
                    {category.name}
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    {category.description}
                </p>
            </div>

            <div className="space-y-5">
                {category.items.map((item) => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        onChange={onItemChange}
                        value={values[item.id]}
                    />
                ))}
            </div>
        </div>
    )
}
