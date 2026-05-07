import {
    useEffect,
    useMemo,
    useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import AppLayout from '../../components/layouts/AppLayout'
import FormInput from '../../components/forms/FormInput'
import FormSelect from '../../components/forms/FormSelect'
import FormTextarea from '../../components/forms/FormTextarea'
import CorrectiveActionStatusBadge from '../../components/corrective-actions/CorrectiveActionStatusBadge'
import {
    useAuth,
} from '../../hooks/useAuth'
import {
    useCloseCorrectiveAction,
    useCorrectiveAction,
    useCorrectiveActionEvidence,
    useTransitionCorrectiveAction,
    useUpdateCorrectiveAction,
    useUploadCorrectiveActionEvidence,
    useVerifyCorrectiveAction,
} from '../../hooks/useCorrectiveActions'
import {
    addToQueue,
} from '../../offline/offlineQueue'
import {
    getUsers,
} from '../../services/userService'
import {
    ROLES,
} from '../../utils/permissions'
import {
    formatDate,
    formatLabel,
} from '../../utils/formatters'
import {
    getErrorMessage,
} from '../../utils/api'

const priorities = [
    'low',
    'medium',
    'high',
    'critical',
]

function buildAttachmentUrl(
    storagePath
) {
    if (!storagePath) {
        return '#'
    }

    return `http://localhost:5000/${storagePath}`
}

export default function CorrectiveActionDetailsPage() {
    const { id } = useParams()
    const { user, role } = useAuth()
    const correctiveActionQuery =
        useCorrectiveAction(id)
    const evidenceQuery =
        useCorrectiveActionEvidence(
            id
        )
    const updateMutation =
        useUpdateCorrectiveAction()
    const transitionMutation =
        useTransitionCorrectiveAction()
    const closeMutation =
        useCloseCorrectiveAction()
    const verifyMutation =
        useVerifyCorrectiveAction()
    const uploadMutation =
        useUploadCorrectiveActionEvidence()
    const assigneeQuery = useQuery({
        queryKey: ['users', 'assignees'],
        queryFn: () => getUsers(),
        enabled: role === ROLES.HQ,
        staleTime: 60 * 1000,
    })

    const record =
        correctiveActionQuery.data
            ?.record
    const history =
        correctiveActionQuery.data
            ?.history
    const evidence =
        evidenceQuery.data ?? []

    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: '',
        closureEvidence: '',
        verificationComments: '',
    })
    const [submitError, setSubmitError] =
        useState('')
    const [uploadProgress, setUploadProgress] =
        useState({})

    useEffect(() => {
        if (!record) {
            return
        }

        setForm({
            title:
                record.title || '',
            description:
                record.description ||
                '',
            priority:
                record.priority ||
                'medium',
            dueDate:
                record.dueDate || '',
            assignedTo:
                record.assignedTo ||
                '',
            closureEvidence:
                record.closureEvidence ||
                '',
            verificationComments:
                record.verificationComments ||
                '',
        })
    }, [record])

    const canAssign =
        role === ROLES.HQ
    const canVerify =
        role === ROLES.HQ &&
        record?.status ===
            'pending_verification'
    const canRequestVerification =
        record &&
        [
            'open',
            'in_progress',
            'overdue',
        ].includes(record.status) &&
        (!record.assignedTo ||
            record.assignedTo ===
                user?.id ||
            role === ROLES.HQ)

    const assignees =
        assigneeQuery.data?.data ??
        []

    const timelineItems = useMemo(() => {
        const approvalLogs =
            history?.approvalLogs?.map(
                (item) => ({
                    id: `approval-${item.id}`,
                    label: `${formatLabel(item.action)}: ${formatLabel(item.toStatus)}`,
                    detail:
                        item.comments ||
                        `${formatLabel(
                            item.fromStatus
                        )} to ${formatLabel(
                            item.toStatus
                        )}`,
                    timestamp:
                        item.createdAt,
                })
            ) ?? []
        const auditLogs =
            history?.auditLogs?.map(
                (item) => ({
                    id: `audit-${item.id}`,
                    label: formatLabel(
                        item.action
                    ),
                    detail:
                        item.comments,
                    timestamp:
                        item.createdAt,
                })
            ) ?? []

        return [
            ...approvalLogs,
            ...auditLogs,
        ].sort(
            (a, b) =>
                new Date(
                    b.timestamp
                ) -
                new Date(
                    a.timestamp
                )
        )
    }, [history])

    function updateField(field, value) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }))
    }

    async function handleSave() {
        setSubmitError('')
        const payload = {
            title: form.title,
            description:
                form.description,
            priority: form.priority,
            dueDate: form.dueDate,
            assignedTo:
                form.assignedTo || null,
            closureEvidence:
                form.closureEvidence,
            verificationComments:
                form.verificationComments,
        }

        if (!navigator.onLine) {
            addToQueue({
                module:
                    'corrective_action',
                action: 'update',
                id,
                payload,
            })
            return
        }

        try {
            await updateMutation.mutateAsync(
                {
                    id,
                    payload,
                }
            )
        } catch (error) {
            setSubmitError(
                getErrorMessage(error)
            )
        }
    }

    async function handleStatusChange(
        status
    ) {
        setSubmitError('')

        const payload = {
            status,
            comments: `Status updated to ${status}`,
        }

        if (!navigator.onLine) {
            addToQueue({
                module:
                    'corrective_action',
                action:
                    'transition',
                id,
                payload,
            })
            return
        }

        try {
            await transitionMutation.mutateAsync(
                {
                    id,
                    payload,
                }
            )
        } catch (error) {
            setSubmitError(
                getErrorMessage(error)
            )
        }
    }

    async function handleRequestVerification() {
        setSubmitError('')

        const payload = {
            closureEvidence:
                form.closureEvidence,
            verificationComments:
                form.verificationComments,
        }

        if (!navigator.onLine) {
            addToQueue({
                module:
                    'corrective_action',
                action: 'update',
                id,
                payload,
            })
            addToQueue({
                module:
                    'corrective_action',
                action:
                    'transition',
                id,
                payload: {
                    status:
                        'pending_verification',
                    comments:
                        'Queued closure verification request',
                },
            })
            return
        }

        try {
            await closeMutation.mutateAsync(
                {
                    id,
                    payload,
                }
            )
        } catch (error) {
            setSubmitError(
                getErrorMessage(error)
            )
        }
    }

    async function handleVerify() {
        setSubmitError('')

        try {
            await verifyMutation.mutateAsync(
                {
                    id,
                    payload: {
                        verificationComments:
                            form.verificationComments,
                    },
                }
            )
        } catch (error) {
            setSubmitError(
                getErrorMessage(error)
            )
        }
    }

    async function handleUpload(
        event
    ) {
        const files = Array.from(
            event.target.files || []
        )

        if (!files.length) {
            return
        }

        if (!navigator.onLine) {
            setSubmitError(
                'Evidence uploads require an online connection.'
            )
            return
        }

        setSubmitError('')

        for (const file of files) {
            await uploadMutation.mutateAsync(
                {
                    id,
                    payload: {
                        file,
                        siteId:
                            record?.siteId,
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
            )
        }
    }

    return (
        <AppLayout>
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {record?.title ||
                                'Corrective Action'}
                        </h1>
                        <p className="mt-2 text-zinc-400">
                            {record
                                ? `${formatLabel(record.sourceModule)} · Due ${formatDate(record.dueDate)}`
                                : 'Operational corrective action workflow'}
                        </p>
                    </div>

                    {record ? (
                        <CorrectiveActionStatusBadge
                            status={
                                record.status
                            }
                        />
                    ) : null}
                </div>

                {correctiveActionQuery.isLoading ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm text-zinc-400">
                        Loading corrective action details...
                    </div>
                ) : correctiveActionQuery.isError ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                        <p className="text-sm text-red-300">
                            Unable to load corrective action details.
                        </p>
                    </div>
                ) : record ? (
                    <>
                        <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
                            <div className="space-y-8">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormInput
                                            label="Title"
                                            value={
                                                form.title
                                            }
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

                                        <FormSelect
                                            label="Priority"
                                            options={
                                                priorities
                                            }
                                            value={
                                                form.priority
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateField(
                                                    'priority',
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <FormInput
                                            label="Due Date"
                                            type="date"
                                            value={
                                                form.dueDate
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateField(
                                                    'dueDate',
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        {canAssign ? (
                                            <FormSelect
                                                label="Assignee"
                                                options={[
                                                    {
                                                        id: '',
                                                        firstName:
                                                            'Unassigned',
                                                        lastName:
                                                            '',
                                                    },
                                                    ...assignees,
                                                ]}
                                                value={
                                                    form.assignedTo
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateField(
                                                        'assignedTo',
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                getOptionLabel={(
                                                    option
                                                ) =>
                                                    option.id
                                                        ? [
                                                              option.firstName,
                                                              option.lastName,
                                                          ]
                                                              .filter(
                                                                  Boolean
                                                              )
                                                              .join(
                                                                  ' '
                                                              )
                                                        : 'Unassigned'
                                                }
                                                getOptionValue={(
                                                    option
                                                ) =>
                                                    option.id
                                                }
                                            />
                                        ) : (
                                            <FormInput
                                                label="Assignee"
                                                value={
                                                    [
                                                        record
                                                            .assignee
                                                            ?.firstName,
                                                        record
                                                            .assignee
                                                            ?.lastName,
                                                    ]
                                                        .filter(
                                                            Boolean
                                                        )
                                                        .join(
                                                            ' '
                                                        ) ||
                                                    'Unassigned'
                                                }
                                                readOnly
                                            />
                                        )}
                                    </div>

                                    <div className="mt-6">
                                        <FormTextarea
                                            label="Description"
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

                                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                                        <FormTextarea
                                            label="Closure Evidence Summary"
                                            value={
                                                form.closureEvidence
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateField(
                                                    'closureEvidence',
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <FormTextarea
                                            label="Verification Comments"
                                            value={
                                                form.verificationComments
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateField(
                                                    'verificationComments',
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        />
                                    </div>

                                    {submitError ? (
                                        <p className="mt-4 text-sm text-red-400">
                                            {
                                                submitError
                                            }
                                        </p>
                                    ) : null}

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={
                                                handleSave
                                            }
                                            disabled={
                                                updateMutation.isPending
                                            }
                                            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-70"
                                        >
                                            Save Updates
                                        </button>

                                        {record.status ===
                                        'open' ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStatusChange(
                                                        'in_progress'
                                                    )
                                                }
                                                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium hover:bg-white/[0.03]"
                                            >
                                                Start Work
                                            </button>
                                        ) : null}

                                        {canRequestVerification ? (
                                            <button
                                                type="button"
                                                onClick={
                                                    handleRequestVerification
                                                }
                                                disabled={
                                                    closeMutation.isPending
                                                }
                                                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium hover:bg-white/[0.03] disabled:opacity-70"
                                            >
                                                Submit for Verification
                                            </button>
                                        ) : null}

                                        {canVerify ? (
                                            <button
                                                type="button"
                                                onClick={
                                                    handleVerify
                                                }
                                                disabled={
                                                    verifyMutation.isPending
                                                }
                                                className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-70"
                                            >
                                                Verify and Close
                                            </button>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold">
                                            Evidence
                                        </h2>
                                        <p className="mt-2 text-sm text-zinc-400">
                                            Upload images, PDFs, and videos supporting closure verification.
                                        </p>
                                    </div>

                                    <input
                                        type="file"
                                        multiple
                                        onChange={
                                            handleUpload
                                        }
                                        className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-3 file:text-sm file:font-semibold file:text-black hover:file:bg-zinc-200"
                                    />

                                    {Object.keys(
                                        uploadProgress
                                    ).length ? (
                                        <div className="mt-4 space-y-2 text-sm text-zinc-400">
                                            {Object.entries(
                                                uploadProgress
                                            ).map(
                                                ([
                                                    name,
                                                    percent,
                                                ]) => (
                                                    <p
                                                        key={
                                                            name
                                                        }
                                                    >
                                                        {name}: {percent}%
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    ) : null}

                                    <div className="mt-6 space-y-3">
                                        {evidence.map(
                                            (
                                                attachment
                                            ) => (
                                                <a
                                                    key={
                                                        attachment.id
                                                    }
                                                    href={buildAttachmentUrl(
                                                        attachment.storagePath
                                                    )}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm text-zinc-300 hover:bg-white/[0.04]"
                                                >
                                                    <div className="font-medium text-white">
                                                        {
                                                            attachment.originalName
                                                        }
                                                    </div>
                                                    <div className="mt-1 text-xs text-zinc-500">
                                                        {
                                                            attachment.mimeType
                                                        }{' '}
                                                        ·{' '}
                                                        {Math.round(
                                                            attachment.fileSize /
                                                                1024
                                                        )}{' '}
                                                        KB
                                                    </div>
                                                </a>
                                            )
                                        )}

                                        {!evidence.length &&
                                        !evidenceQuery.isLoading ? (
                                            <p className="text-sm text-zinc-400">
                                                No evidence uploaded yet.
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                                    <h2 className="text-xl font-semibold">
                                        Linked Record
                                    </h2>
                                    <div className="mt-4 space-y-2 text-sm text-zinc-400">
                                        <p>
                                            Source Type: {formatLabel(record.sourceModule)}
                                        </p>
                                        <p>
                                            Source ID: {record.sourceRecordId}
                                        </p>
                                        <p>
                                            Due Date: {formatDate(record.dueDate)}
                                        </p>
                                        <p>
                                            Closed At: {formatDate(record.closedAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                                    <h2 className="text-xl font-semibold">
                                        Timeline
                                    </h2>
                                    <div className="mt-6 space-y-4">
                                        {timelineItems.length ? (
                                            timelineItems.map(
                                                (
                                                    item
                                                ) => (
                                                    <div
                                                        key={
                                                            item.id
                                                        }
                                                        className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                                                    >
                                                        <p className="text-sm font-medium text-white">
                                                            {
                                                                item.label
                                                            }
                                                        </p>
                                                        <p className="mt-1 text-sm text-zinc-400">
                                                            {
                                                                item.detail
                                                            }
                                                        </p>
                                                        <p className="mt-2 text-xs text-zinc-500">
                                                            {formatDate(
                                                                item.timestamp
                                                            )}
                                                        </p>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <p className="text-sm text-zinc-400">
                                                No audit history yet.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </AppLayout>
    )
}
