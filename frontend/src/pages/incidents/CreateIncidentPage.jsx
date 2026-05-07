import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import AppLayout from '../../components/layouts/AppLayout'

import FormInput from '../../components/forms/FormInput'
import FormSelect from '../../components/forms/FormSelect'
import FormTextarea from '../../components/forms/FormTextarea'

import IncidentInjuryCard from '../../components/incidents/IncidentInjuryCard'
import RootCauseAnalysis from '../../components/incidents/RootCauseAnalysis'
import IncidentEvidenceUpload from '../../components/incidents/IncidentEvidenceUpload'
import {
    useCreateIncident,
    useUploadIncidentEvidence,
} from '../../hooks/useIncidents'
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
    retryOperation,
} from '../../offline/retryManager'
import {
    getErrorMessage,
} from '../../utils/api'

const DRAFT_KEY = 'incident_create'

const initialForm = {
    title: '',
    eventDate: '',
    incidentType: 'accident',
    severity: 'minor',
    siteId: '',
    location: '',
    description: '',
    affectedPerson: '',
    injurySeverity: 'Minor',
    bodyPartAffected: '',
    daysLost: '',
    immediateCause: '',
    underlyingCause: '',
    correctiveMeasures: '',
}

function validateForm(form) {
    if (!form.title.trim()) {
        return 'Incident title is required.'
    }

    if (!form.eventDate) {
        return 'Incident date is required.'
    }

    if (!form.siteId) {
        return 'Site is required.'
    }

    if (!form.location.trim()) {
        return 'Location is required.'
    }

    if (!form.description.trim()) {
        return 'Incident description is required.'
    }

    return ''
}

export default function CreateIncidentPage() {
    const navigate = useNavigate()
    const createIncidentMutation =
        useCreateIncident()
    const uploadEvidenceMutation =
        useUploadIncidentEvidence()
    const { data: siteData } =
        useSites()
    const draft =
        loadDraft(DRAFT_KEY)
    const [form, setForm] = useState(
        draft?.data ?? initialForm
    )
    const [files, setFiles] = useState([])
    const [submitError, setSubmitError] =
        useState('')
    const [uploadProgress, setUploadProgress] =
        useState({})

    const sites = siteData?.data ?? []

    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }))
    }

    function persistDraft() {
        saveDraft(DRAFT_KEY, form)
        toast.success('Draft saved.')
    }

    function handleFileChange(event) {
        setFiles(
            Array.from(
                event.target.files ?? []
            )
        )
    }

    async function handleSubmit(
        event
    ) {
        event.preventDefault()
        const validationError =
            validateForm(form)

        setSubmitError(
            validationError
        )

        if (validationError) {
            toast.error(
                validationError
            )
            return
        }

        const payload = {
            siteId: form.siteId,
            incidentType:
                form.incidentType,
            severity: form.severity,
            eventDate:
                form.eventDate,
            location: form.location,
            description: form.title
                ? `${form.title}\n\n${form.description}`
                : form.description,
            peopleInvolved:
                form.affectedPerson
                    ? [
                          {
                              name: form.affectedPerson,
                              role: [
                                  form.injurySeverity,
                                  form.bodyPartAffected,
                                  form.daysLost
                                      ? `${form.daysLost} day(s) lost`
                                      : null,
                              ]
                                  .filter(Boolean)
                                  .join(' - '),
                          },
                      ]
                    : [],
            immediateActions:
                form.immediateCause,
            rootCause:
                form.underlyingCause,
            recommendedActions:
                form.correctiveMeasures,
        }

        if (!navigator.onLine) {
            addToQueue({
                module: 'incident',
                action: 'create',
                payload,
            })
            persistDraft()
            if (files.length) {
                toast(
                    'Evidence files will need to be uploaded when you are back online.'
                )
            }
            navigate(
                '/incidents'
            )
            return
        }

        try {
            const createdIncident =
                await createIncidentMutation.mutateAsync(
                    payload
                )

            for (const file of files) {
                await retryOperation(
                    () =>
                        uploadEvidenceMutation.mutateAsync(
                            {
                                id: createdIncident.id,
                                payload: {
                                    file,
                                    siteId:
                                        form.siteId,
                                    onUploadProgress:
                                        (
                                            progressEvent
                                        ) => {
                                            const total =
                                                progressEvent.total ||
                                                0
                                            const percent =
                                                total
                                                    ? Math.round(
                                                          (progressEvent.loaded /
                                                              total) *
                                                              100
                                                      )
                                                    : 0

                                            setUploadProgress(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,
                                                    [file.name]:
                                                        percent,
                                                })
                                            )
                                        },
                                },
                            }
                        ),
                    2
                )
            }

            toast.success(
                files.length
                    ? 'Incident and evidence saved.'
                    : 'Incident saved.'
            )
            removeDraft(DRAFT_KEY)
            navigate(
                '/incidents'
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
                        Report Incident
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        Submit and investigate workplace incidents
                    </p>
                </div>

                <form
                    className="space-y-8"
                    onSubmit={
                        handleSubmit
                    }
                >
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold">
                                Incident Information
                            </h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <FormInput
                                label="Incident Title"
                                placeholder="Worker fall from scaffold"
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
                                label="Incident Date"
                                type="date"
                                value={
                                    form.eventDate
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        'eventDate',
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

                            <FormInput
                                label="Location"
                                placeholder="Packing Line 2"
                                value={
                                    form.location
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        'location',
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />

                            <FormSelect
                                label="Incident Type"
                                options={[
                                    {
                                        value: 'accident',
                                        label: 'Accident',
                                    },
                                    {
                                        value: 'near_miss',
                                        label: 'Near Miss',
                                    },
                                    {
                                        value: 'unsafe_condition',
                                        label: 'Unsafe Condition',
                                    },
                                    {
                                        value: 'unsafe_act',
                                        label: 'Unsafe Act',
                                    },
                                ]}
                                value={
                                    form.incidentType
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        'incidentType',
                                        event
                                            .target
                                            .value
                                    )
                                }
                                getOptionLabel={(
                                    option
                                ) =>
                                    option.label
                                }
                                getOptionValue={(
                                    option
                                ) =>
                                    option.value
                                }
                            />

                            <FormSelect
                                label="Severity"
                                options={[
                                    {
                                        value: 'minor',
                                        label: 'Low',
                                    },
                                    {
                                        value: 'moderate',
                                        label: 'Medium',
                                    },
                                    {
                                        value: 'major',
                                        label: 'High',
                                    },
                                    {
                                        value: 'critical',
                                        label: 'Critical',
                                    },
                                ]}
                                value={
                                    form.severity
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        'severity',
                                        event
                                            .target
                                            .value
                                    )
                                }
                                getOptionLabel={(
                                    option
                                ) =>
                                    option.label
                                }
                                getOptionValue={(
                                    option
                                ) =>
                                    option.value
                                }
                            />
                        </div>

                        <div className="mt-6">
                            <FormTextarea
                                label="Incident Description"
                                placeholder="Describe incident..."
                                value={
                                    form.description
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        'description',
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>
                    </div>

                    <IncidentInjuryCard
                        values={form}
                        onChange={
                            updateField
                        }
                    />

                    <RootCauseAnalysis
                        values={form}
                        onChange={
                            updateField
                        }
                    />

                    <IncidentEvidenceUpload
                        files={files}
                        onChange={
                            handleFileChange
                        }
                        disabled={
                            createIncidentMutation.isPending ||
                            uploadEvidenceMutation.isPending
                        }
                        uploadProgress={
                            uploadProgress
                        }
                        helperText="Images, videos, and PDFs are supported."
                    />

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
                                createIncidentMutation.isPending
                            }
                            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-70"
                        >
                            {createIncidentMutation.isPending
                                ? 'Submitting...'
                                : 'Submit Incident'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
