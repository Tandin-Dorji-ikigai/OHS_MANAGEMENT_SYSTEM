import FormTextarea from '../forms/FormTextarea'

export default function ManagementReviewCard() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <div className="mb-8">
                <h2 className="text-2xl font-bold">
                    Management Review
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Executive oversight and management comments
                </p>
            </div>

            <FormTextarea
                label="Management Comments"
                placeholder="Enter management observations..."
            />
        </div>
    )
}