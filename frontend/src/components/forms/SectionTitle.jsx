export default function SectionTitle({
    title,
    description,
}) {
    return (
        <div className="mb-6">

            <h2 className="text-xl font-semibold text-white">
                {title}
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
                {description}
            </p>
        </div>
    )
}