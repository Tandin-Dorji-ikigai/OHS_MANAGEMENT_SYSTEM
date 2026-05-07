import FormTextarea from '../forms/FormTextarea'

export default function RootCauseAnalysis({
    values,
    onChange,
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold">
                    Root Cause Analysis
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Investigate underlying causes of incident
                </p>
            </div>

            <div className="space-y-6">
                <FormTextarea
                    label="Immediate Cause"
                    placeholder="Describe immediate cause..."
                    value={values.immediateCause}
                    onChange={(event) =>
                        onChange(
                            'immediateCause',
                            event.target.value
                        )
                    }
                />

                <FormTextarea
                    label="Underlying Cause"
                    placeholder="Describe root cause..."
                    value={
                        values.underlyingCause
                    }
                    onChange={(event) =>
                        onChange(
                            'underlyingCause',
                            event.target.value
                        )
                    }
                />

                <FormTextarea
                    label="Corrective Measures"
                    placeholder="Describe preventive measures..."
                    value={
                        values.correctiveMeasures
                    }
                    onChange={(event) =>
                        onChange(
                            'correctiveMeasures',
                            event.target.value
                        )
                    }
                />
            </div>
        </div>
    )
}
