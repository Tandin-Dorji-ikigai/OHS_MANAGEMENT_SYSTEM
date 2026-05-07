import FormInput from '../forms/FormInput'
import FormSelect from '../forms/FormSelect'

export default function InvestigationAssignment({
    values,
    investigators = [],
    onChange,
    onAssign,
    disabled = false,
    canAssign = false,
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <div className="mb-8">
                <h2 className="text-2xl font-bold">
                    Investigation Assignment
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Assign investigator and define investigation priority
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {canAssign ? (
                    <FormSelect
                        label="Assigned Investigator"
                        value={
                            values.investigatorId
                        }
                        onChange={(
                            event
                        ) =>
                            onChange(
                                'investigatorId',
                                event.target.value
                            )
                        }
                        options={[
                            {
                                id: '',
                                fullName:
                                    'Select investigator',
                            },
                            ...investigators,
                        ]}
                        getOptionLabel={(
                            option
                        ) =>
                            option.fullName
                        }
                        getOptionValue={(
                            option
                        ) => option.id}
                    />
                ) : (
                    <FormInput
                        label="Assigned Investigator"
                        value={
                            values.investigatorName
                        }
                        readOnly
                    />
                )}

                <FormSelect
                    label="Investigation Priority"
                    options={[
                        'Low',
                        'Medium',
                        'High',
                        'Critical',
                    ]}
                    value={
                        values.priority
                    }
                    onChange={(
                        event
                    ) =>
                        onChange(
                            'priority',
                            event.target.value
                        )
                    }
                />

                <FormInput
                    label="Investigation Deadline"
                    type="date"
                    value={
                        values.deadline
                    }
                    onChange={(
                        event
                    ) =>
                        onChange(
                            'deadline',
                            event.target.value
                        )
                    }
                />

                <FormSelect
                    label="Investigation Status"
                    options={[
                        'Assigned',
                        'Investigating',
                        'Pending HQ Review',
                        'Closed',
                    ]}
                    value={
                        values.status
                    }
                    onChange={(
                        event
                    ) =>
                        onChange(
                            'status',
                            event.target.value
                        )
                    }
                />
            </div>

            {canAssign ? (
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onAssign}
                        disabled={disabled}
                        className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-70"
                    >
                        Save Investigation
                    </button>
                </div>
            ) : null}
        </div>
    )
}
