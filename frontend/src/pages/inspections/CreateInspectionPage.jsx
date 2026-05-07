import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AppLayout from '../../components/layouts/AppLayout'

import FormInput from '../../components/forms/FormInput'
import FormTextarea from '../../components/forms/FormTextarea'
import FormSelect from '../../components/forms/FormSelect'
import SectionTitle from '../../components/forms/SectionTitle'

import ChecklistCategory from '../../components/checklists/ChecklistCategory'
import ChecklistScoreCard from '../../components/checklists/ChecklistScoreCard'

import { inspectionChecklist } from '../../constants/checklists'
import { useCreateInspection } from '../../hooks/useInspections'
import { useSites } from '../../hooks/useSites'
import {
    addToQueue,
} from '../../offline/offlineQueue'
import {
    loadDraft,
    removeDraft,
    saveDraft,
} from '../../offline/draftStorage'
import {
    getErrorMessage,
} from '../../utils/api'

const DRAFT_KEY = 'inspection_create'

const initialForm = {
    title: '',
    scheduleDate: '',
    inspectionDate: '',
    siteId: '',
    templateName: 'Routine',
    observations: '',
    recommendations: '',
    riskLevel: 'medium',
}

function buildInitialResponses() {
    return {}
}

export default function CreateInspectionPage() {
    const navigate = useNavigate()
    const createInspectionMutation =
        useCreateInspection()
    const { data: siteData } =
        useSites()
    const draft =
        loadDraft(DRAFT_KEY)
    const [form, setForm] = useState(
        draft?.data?.form ??
            initialForm
    )
    const [responses, setResponses] =
        useState(
            draft?.data?.responses ??
                buildInitialResponses()
        )
    const [submitError, setSubmitError] =
        useState('')

    const sites = siteData?.data ?? []

    const handleChecklistChange = (
        response
    ) => {
        setResponses((prev) => ({
            ...prev,
            [response.id]: response,
        }))
    }

    const complianceScore = useMemo(() => {
        const responseItems =
            Object.values(responses)
        const passed =
            responseItems.filter(
                (item) =>
                    item.status === 'pass'
            ).length

        const failed =
            responseItems.filter(
                (item) =>
                    item.status === 'fail'
            ).length

        const total = passed + failed

        if (total === 0) return 0

        return Math.round(
            (passed / total) * 100
        )
    }, [responses])

    const items = useMemo(
        () =>
            inspectionChecklist.flatMap(
                (category) =>
                    category.items
                        .filter(
                            (item) =>
                                responses[
                                    item.id
                                ]?.status &&
                                responses[
                                    item.id
                                ]?.status !==
                                    'na'
                        )
                        .map((item, index) => ({
                            checklistText:
                                item.title,
                            isCompliant:
                                responses[
                                    item.id
                                ]?.status ===
                                'pass',
                            comments:
                                responses[
                                    item.id
                                ]?.notes ??
                                '',
                            sortOrder:
                                index,
                        }))
            ),
        [responses]
    )

    const findings = useMemo(
        () =>
            inspectionChecklist.flatMap(
                (category) =>
                    category.items
                        .filter(
                            (item) =>
                                responses[
                                    item.id
                                ]?.status ===
                                'fail'
                        )
                        .map((item) => ({
                            title: item.title,
                            description:
                                responses[
                                    item.id
                                ]?.notes ||
                                item.description,
                            recommendation:
                                form.recommendations,
                            priority:
                                form.riskLevel,
                            actionRequired:
                                true,
                        }))
            ),
        [form.recommendations, form.riskLevel, responses]
    )

    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }))
    }

    function persistDraft() {
        saveDraft(DRAFT_KEY, {
            form,
            responses,
        })
    }

    async function handleSubmit(
        event
    ) {
        event.preventDefault()
        setSubmitError('')

        const payload = {
            title: form.title,
            siteId: form.siteId,
            scheduleDate:
                form.scheduleDate ||
                null,
            inspectionDate:
                form.inspectionDate ||
                null,
            templateName:
                form.templateName,
            observations:
                form.observations,
            recommendations:
                form.recommendations,
            items,
            findings,
        }

        if (!navigator.onLine) {
            addToQueue({
                module: 'inspection',
                action: 'create',
                payload,
            })
            persistDraft()
            navigate(
                '/inspections'
            )
            return
        }

        try {
            await createInspectionMutation.mutateAsync(
                payload
            )
            removeDraft(DRAFT_KEY)
            navigate(
                '/inspections'
            )
        } catch (error) {
            setSubmitError(
                getErrorMessage(error)
            )
        }
    }

    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold">
                        Create Inspection
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        Conduct and submit a field inspection
                    </p>
                </div>

                <form
                    className="space-y-10"
                    onSubmit={
                        handleSubmit
                    }
                >
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                        <SectionTitle
                            title="General Information"
                            description="Basic inspection information"
                        />

                        <div className="grid gap-6 md:grid-cols-2">
                            <FormInput
                                label="Inspection Title"
                                placeholder="Monthly site inspection"
                                value={form.title}
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        'title',
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />

                            <FormInput
                                label="Inspection Date"
                                type="date"
                                value={
                                    form.inspectionDate
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        'inspectionDate',
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />

                            <FormSelect
                                label="Site"
                                options={sites}
                                value={form.siteId}
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        'siteId',
                                        event
                                            .target
                                            .value
                                    )
                                }
                                getOptionLabel={(
                                    option
                                ) =>
                                    option.name
                                }
                                getOptionValue={(
                                    option
                                ) => option.id}
                            />

                            <FormSelect
                                label="Inspection Type"
                                options={[
                                    'Routine',
                                    'Emergency',
                                    'Audit',
                                ]}
                                value={
                                    form.templateName
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        'templateName',
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                        <SectionTitle
                            title="Inspection Findings"
                            description="Record findings and observations"
                        />

                        <div className="space-y-6">
                            <FormTextarea
                                label="Findings"
                                placeholder="Describe the inspection findings..."
                                value={
                                    form.observations
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        'observations',
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />

                            <FormTextarea
                                label="Recommendations"
                                placeholder="Enter recommendations..."
                                value={
                                    form.recommendations
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        'recommendations',
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />

                            <FormSelect
                                label="Risk Level"
                                options={[
                                    'low',
                                    'medium',
                                    'high',
                                    'critical',
                                ]}
                                value={
                                    form.riskLevel
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        'riskLevel',
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
                        <div className="space-y-8">
                            {inspectionChecklist.map(
                                (category) => (
                                    <ChecklistCategory
                                        key={
                                            category.id
                                        }
                                        category={
                                            category
                                        }
                                        onItemChange={
                                            handleChecklistChange
                                        }
                                        values={
                                            responses
                                        }
                                    />
                                )
                            )}
                        </div>

                        <ChecklistScoreCard
                            score={
                                complianceScore
                            }
                        />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                        <SectionTitle
                            title="Evidence Upload"
                            description="Upload supporting images and documents"
                        />

                        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
                            <div className="text-center">
                                <p className="text-lg font-medium">
                                    Upload files
                                </p>

                                <p className="mt-2 text-sm text-zinc-400">
                                    Drag and drop images or documents here
                                </p>

                                <button
                                    type="button"
                                    className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
                                >
                                    Choose Files
                                </button>
                            </div>
                        </div>
                    </div>

                    {submitError ? (
                        <p className="text-sm text-red-400">
                            {submitError}
                        </p>
                    ) : null}

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={
                                persistDraft
                            }
                            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium hover:bg-white/[0.03]"
                        >
                            Save Draft
                        </button>

                        <button
                            type="submit"
                            disabled={
                                createInspectionMutation.isPending
                            }
                            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-70"
                        >
                            {createInspectionMutation.isPending
                                ? 'Submitting...'
                                : 'Submit Inspection'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
