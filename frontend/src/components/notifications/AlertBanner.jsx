export default function AlertBanner({
    title,
    description,
}) {
    return (
        <div
            className="
        mb-6 rounded-2xl border border-red-500/20
        bg-red-500/5 p-5
      "
        >
            <h3 className="font-semibold text-red-400">
                {title}
            </h3>

            <p className="mt-2 text-sm text-zinc-300">
                {description}
            </p>
        </div>
    )
}