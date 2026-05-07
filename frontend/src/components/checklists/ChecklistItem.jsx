import { useEffect, useState } from 'react'

import {
    Field,
    Label,
    Textarea,
} from '@headlessui/react'

import clsx from 'clsx'

export default function ChecklistItem({
    item,
    onChange,
    value,
}) {
    const [status, setStatus] = useState(null)
    const [notes, setNotes] = useState('')

    useEffect(() => {
        setStatus(value?.status ?? null)
        setNotes(value?.notes ?? '')
    }, [value])

    const handleStatus = (value) => {
        setStatus(value)

        onChange({
            id: item.id,
            status: value,
            notes,
        })
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                <div>
                    <h4 className="font-medium text-white">
                        {item.title}
                    </h4>

                    <p className="mt-1 text-sm text-zinc-400">
                        {item.description}
                    </p>
                </div>

                <div className="flex gap-3">

                    <button
                        type="button"
                        onClick={() => handleStatus('pass')}
                        className={clsx(
                            'rounded-xl px-4 py-2 text-sm font-medium transition',
                            status === 'pass'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                        )}
                    >
                        Pass
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatus('fail')}
                        className={clsx(
                            'rounded-xl px-4 py-2 text-sm font-medium transition',
                            status === 'fail'
                                ? 'bg-red-500 text-white'
                                : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                        )}
                    >
                        Fail
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatus('na')}
                        className={clsx(
                            'rounded-xl px-4 py-2 text-sm font-medium transition',
                            status === 'na'
                                ? 'bg-yellow-500 text-black'
                                : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
                        )}
                    >
                        N/A
                    </button>
                </div>
            </div>

            <Field className="mt-5">
                <Label className="text-sm font-medium text-white">
                    Notes / Findings
                </Label>

                <Textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => {
                        const nextNotes =
                            e.target.value
                        setNotes(nextNotes)
                        onChange({
                            id: item.id,
                            status,
                            notes: nextNotes,
                        })
                    }}
                    placeholder="Enter findings or observations..."
                    className="
            mt-3 block w-full rounded-xl border border-white/10
            bg-white/[0.03] px-4 py-3 text-sm text-white
            placeholder:text-zinc-500
            focus:outline-none focus:ring-2 focus:ring-white/10
          "
                />
            </Field>
        </div>
    )
}
