export default function ChecklistScoreCard({
    score,
}) {
    return (
        <div className="sticky top-28 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <h3 className="text-lg font-semibold text-white">
                Compliance Score
            </h3>

            <div className="mt-6 flex items-center justify-center">

                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-emerald-500">

                    <div className="text-center">
                        <p className="text-4xl font-bold text-white">
                            {score}%
                        </p>

                        <p className="mt-1 text-sm text-zinc-400">
                            Compliance
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-400">
                Excellent compliance level
            </div>
        </div>
    )
}