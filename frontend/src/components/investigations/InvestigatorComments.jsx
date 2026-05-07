import FormTextarea from '../forms/FormTextarea'

export default function InvestigatorComments({
    values,
    onChange,
    onSave,
    disabled = false,
    canEdit = false,
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <div className="mb-8">
                <h2 className="text-2xl font-bold">
                    Investigator Notes
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Record findings and investigation progress
                </p>
            </div>

            <div className="space-y-6">

                <FormTextarea
                    label="Investigation Summary"
                    placeholder="Enter investigation findings..."
                    value={values.findings}
                    onChange={(event) =>
                        onChange(
                            'findings',
                            event.target.value
                        )
                    }
                    readOnly={!canEdit}
                />

                <FormTextarea
                    label="Witness Statements"
                    placeholder="Record witness observations..."
                    value={
                        values.witnessStatements
                    }
                    onChange={(event) =>
                        onChange(
                            'witnessStatements',
                            event.target.value
                        )
                    }
                    readOnly={!canEdit}
                />

                <FormTextarea
                    label="Recommended Actions"
                    placeholder="Enter recommendations..."
                    value={
                        values.recommendations
                    }
                    onChange={(event) =>
                        onChange(
                            'recommendations',
                            event.target.value
                        )
                    }
                    readOnly={!canEdit}
                />
            </div>

            {canEdit ? (
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={disabled}
                        className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium hover:bg-white/[0.03] disabled:opacity-70"
                    >
                        Save Notes
                    </button>
                </div>
            ) : null}
        </div>
    )
}
