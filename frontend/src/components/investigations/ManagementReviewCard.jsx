import FormTextarea from '../forms/FormTextarea'

export default function ManagementReviewCard({
    value,
    onChange,
    onSave,
    disabled = false,
    canEdit = false,
}) {
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
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                readOnly={!canEdit}
            />

            {canEdit && onSave ? (
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={disabled}
                        className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium hover:bg-white/[0.03] disabled:opacity-70"
                    >
                        Save Review
                    </button>
                </div>
            ) : null}
        </div>
    )
}
