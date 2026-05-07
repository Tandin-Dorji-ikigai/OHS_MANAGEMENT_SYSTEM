import {
    useEffect,
    useMemo,
    useState,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import AppLayout from '../../components/layouts/AppLayout'
import IncidentEvidenceUpload from '../../components/incidents/IncidentEvidenceUpload'
import IncidentApprovalPanel from '../../components/investigations/IncidentApprovalPanel'
import EscalationPanel from '../../components/investigations/EscalationPanel'
import InvestigationAssignment from '../../components/investigations/InvestigationAssignment'
import InvestigatorComments from '../../components/investigations/InvestigatorComments'
import InvestigationTimeline from '../../components/investigations/InvestigationTimeline'
import ManagementReviewCard from '../../components/investigations/ManagementReviewCard'
import {
    useAuth,
} from '../../hooks/useAuth'
import {
    useAddIncidentInvestigation,
    useApproveIncident,
    useAssignInvestigator,
    useCloseIncident,
    useIncident,
    useIncidentEvidence,
    useRejectIncident,
    useSaveIncidentManagementReview,
    useTransitionIncident,
    useUploadIncidentEvidence,
} from '../../hooks/useIncidents'
import {
    retryOperation,
} from '../../offline/retryManager'
import {
    getCorrectiveActions,
} from '../../services/correctiveActionService'
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

const API_ORIGIN =
    (
        import.meta.env.VITE_API_URL ??
        'http://localhost:5000/api'
    ).replace(/\/api\/?$/, '')

function buildAttachmentUrl(
    storagePath
) {
    if (!storagePath) {
        return '#'
    }

    return `${API_ORIGIN}/${storagePath}`
}

function buildPeopleSummary(
    people = []
) {
    return people.map((person) => ({
        name:
            person.name ||
            'Unknown worker',
        detail:
            person.role || 'N/A',
    }))
}

export default function IncidentDetailsPage() {
    const { id } = useParams()
    const { user, role } = useAuth()
    const incidentQuery =
        useIncident(id)
    const evidenceQuery =
        useIncidentEvidence(id)
    const usersQuery = useQuery({
        queryKey: ['users'],
        queryFn: () =>
            getUsers({
                limit: 100,
            }),
        staleTime: 60 * 1000,
    })
    const capaQuery = useQuery({
        queryKey: [
            'incident-capas',
            id,
        ],
        queryFn: () =>
            getCorrectiveActions({
                limit: 100,
            }),
        enabled: Boolean(id),
        select: (data) =>
            (data?.data ?? []).filter(
                (item) =>
                    item.sourceModule ===
                        'incident' &&
                    item.sourceRecordId === id
            ),
    })
    const addInvestigationMutation =
        useAddIncidentInvestigation()
    const assignInvestigatorMutation =
        useAssignInvestigator()
    const transitionMutation =
        useTransitionIncident()
    const approveMutation =
        useApproveIncident()
    const rejectMutation =
        useRejectIncident()
    const closeMutation =
        useCloseIncident()
    const managementReviewMutation =
        useSaveIncidentManagementReview()
    const uploadEvidenceMutation =
        useUploadIncidentEvidence()

    const incident =
        incidentQuery.data?.incident
    const history =
        incidentQuery.data?.history
    const evidence =
        evidenceQuery.data ?? []
    const investigations =
        incident?.investigations ?? []
    const latestInvestigation =
        investigations[0] ?? null

    const [assignmentForm, setAssignmentForm] =
        useState({
            investigatorId: '',
            investigatorName:
                'Unassigned',
            priority: 'Medium',
            deadline: '',
            status: 'Assigned',
        })
    const [commentForm, setCommentForm] =
        useState({
            findings: '',
            witnessStatements: '',
            recommendations: '',
        })
    const [managementReview, setManagementReview] =
        useState('')
    const [submitError, setSubmitError] =
        useState('')
    const [files, setFiles] = useState([])
    const [uploadProgress, setUploadProgress] =
        useState({})

    const userMap = useMemo(
        () =>
            new Map(
                (
                    usersQuery.data
                        ?.data ?? []
                ).map((item) => [
                    item.id,
                    [
                        item.firstName,
                        item.lastName,
                    ]
                        .filter(Boolean)
                        .join(' ') ||
                        item.email,
                ])
            ),
        [usersQuery.data]
    )

    useEffect(() => {
        if (!incident) {
            return
        }

        const currentInvestigator =
            latestInvestigation
                ?.investigator

        setAssignmentForm({
            investigatorId:
                incident.assignedInvestigatorId ??
                currentInvestigator?.id ??
                user?.id ??
                '',
            investigatorName:
                [
                    incident.assignedInvestigator
                        ?.firstName,
                    incident.assignedInvestigator
                        ?.lastName,
                ]
                    .filter(Boolean)
                    .join(' ') ||
                'Unassigned',
            priority:
                formatLabel(
                    incident.severity
                ),
            deadline:
                incident.eventDate
                    ? new Date(
                          new Date(
                              incident.eventDate
                          ).getTime() +
                              3 *
                                  24 *
                                  60 *
                                  60 *
                                  1000
                      )
                          .toISOString()
                          .slice(0, 10)
                    : '',
            status:
                incident.status ===
                'validated'
                    ? 'Pending HQ Review'
                    : incident.status ===
                        'under_review'
                      ? 'Investigating'
                      : incident.status ===
                          'closed'
                        ? 'Closed'
                        : 'Assigned',
        })
        setCommentForm({
            findings:
                latestInvestigation?.findings ??
                '',
            witnessStatements: '',
            recommendations:
                latestInvestigation?.recommendations ??
                incident.recommendedActions ??
                '',
        })
        setManagementReview(
            incident.managementReviewComments ||
                history?.approvalLogs?.[0]
                    ?.comments ||
                ''
        )
    }, [
        history?.approvalLogs,
        incident,
        latestInvestigation,
        user?.id,
    ])

    const canInvestigate =
        role === ROLES.FIELD_OFFICER ||
        role === ROLES.HQ
    const canSubmit =
        role === ROLES.SUPERVISOR &&
        incident?.status === 'draft'
    const canValidate =
        role === ROLES.FIELD_OFFICER &&
        [
            'submitted',
            'under_review',
        ].includes(
            incident?.status
        )
    const canApprove =
        role === ROLES.HQ

    const timelineItems = useMemo(() => {
        if (!incident) {
            return []
        }

        const approvalLogs =
            history?.approvalLogs?.map(
                (item) => ({
                    id: `approval-${item.id}`,
                    title: `${formatLabel(item.action)} ${formatLabel(item.toStatus)}`,
                    user:
                        userMap.get(
                            item.actionBy
                        ) ??
                        item.actionBy ??
                        'System User',
                    time:
                        item.createdAt,
                    kind: 'approval',
                })
            ) ?? []
        const auditLogs =
            history?.auditLogs?.map(
                (item) => ({
                    id: `audit-${item.id}`,
                    title: formatLabel(
                        item.action
                    ),
                    user:
                        userMap.get(
                            item.actionBy
                        ) ??
                        item.actionBy ??
                        'System User',
                    time:
                        item.createdAt,
                    kind: 'audit',
                })
            ) ?? []
        const investigationItems =
            investigations.map(
                (item) => ({
                    id: `investigation-${item.id}`,
                    title:
                        'Investigation Updated',
                    user:
                        [
                            item.investigator
                                ?.firstName,
                            item.investigator
                                ?.lastName,
                        ]
                            .filter(Boolean)
                            .join(' ') ||
                        'Investigator',
                    time:
                        item.investigationDate,
                    kind: 'investigation',
                })
            )
        const evidenceItems =
            evidence.map(
                (item) => ({
                    id: `evidence-${item.id}`,
                    title:
                        'Evidence Uploaded',
                    user:
                        userMap.get(
                            item.uploadedBy
                        ) ??
                        item.uploadedBy ??
                        'Uploader',
                    time:
                        item.createdAt,
                    kind: 'evidence',
                })
            )

        return [
            {
                id: `incident-${incident.id}`,
                title:
                    'Incident Reported',
                user:
                    userMap.get(
                        incident.createdBy
                    ) ??
                    incident.createdBy ??
                    'Reporter',
                time:
                    incident.createdAt ||
                    incident.eventDate,
                kind: 'incident',
            },
            ...approvalLogs,
            ...auditLogs,
            ...investigationItems,
            ...evidenceItems,
        ].sort(
            (a, b) =>
                new Date(b.time) -
                new Date(a.time)
        )
    }, [
        evidence,
        history,
        incident,
        investigations,
        userMap,
    ])

    function updateAssignmentField(
        field,
        value
    ) {
        setAssignmentForm(
            (current) => ({
                ...current,
                [field]: value,
            })
        )
    }

    function updateCommentField(
        field,
        value
    ) {
        setCommentForm(
            (current) => ({
                ...current,
                [field]: value,
            })
        )
    }

    async function handleAssignInvestigator() {
        setSubmitError('')

        try {
            await assignInvestigatorMutation.mutateAsync(
                {
                    id,
                    payload: {
                        investigatorId:
                            assignmentForm.investigatorId,
                        investigationPriority:
                            assignmentForm.priority.toLowerCase(),
                        investigationDueDate:
                            assignmentForm.deadline ||
                            null,
                        comments:
                            'Investigator assignment updated',
                    },
                }
            )
        } catch (error) {
            setSubmitError(
                getErrorMessage(error)
            )
        }
    }

    async function handleAddInvestigation() {
        setSubmitError('')

        try {
            await addInvestigationMutation.mutateAsync(
                {
                    id,
                    payload: {
                        investigationDate:
                            new Date()
                                .toISOString()
                                .slice(0, 10),
                        findings: [
                            commentForm.findings,
                            commentForm.witnessStatements
                                ? `Witness Statements: ${commentForm.witnessStatements}`
                                : null,
                        ]
                            .filter(Boolean)
                            .join(
                                '\n\n'
                            ),
                        rootCauseAnalysis:
                            incident?.rootCause ||
                            null,
                        recommendations:
                            commentForm.recommendations,
                    },
                }
            )
        } catch (error) {
            setSubmitError(
                getErrorMessage(error)
            )
        }
    }

    async function handleTransition(
        status,
        comments
    ) {
        setSubmitError('')

        try {
            await transitionMutation.mutateAsync(
                {
                    id,
                    payload: {
                        status,
                        comments,
                    },
                }
            )
        } catch (error) {
            setSubmitError(
                getErrorMessage(error)
            )
        }
    }

    async function handleApprove() {
        setSubmitError('')

        try {
            if (managementReview) {
                await managementReviewMutation.mutateAsync(
                    {
                        id,
                        payload: {
                            managementReviewComments:
                                managementReview,
                            escalate: false,
                        },
                    }
                )
            }
            await approveMutation.mutateAsync(
                {
                    id,
                    payload: {
                        comments:
                            managementReview ||
                            'Incident approved',
                    },
                }
            )
        } catch (error) {
            setSubmitError(
                getErrorMessage(error)
            )
        }
    }

    async function handleReject() {
        setSubmitError('')

        try {
            await rejectMutation.mutateAsync(
                {
                    id,
                    payload: {
                        comments:
                            managementReview ||
                            'Incident rejected',
                    },
                }
            )
        } catch (error) {
            setSubmitError(
                getErrorMessage(error)
            )
        }
    }

    async function handleClose() {
        setSubmitError('')

        try {
            await closeMutation.mutateAsync(
                {
                    id,
                    payload: {
                        comments:
                            managementReview ||
                            'Incident closed',
                    },
                }
            )
        } catch (error) {
            setSubmitError(
                getErrorMessage(error)
            )
        }
    }

    async function handleSaveManagementReview() {
        setSubmitError('')

        try {
            await managementReviewMutation.mutateAsync(
                {
                    id,
                    payload: {
                        managementReviewComments:
                            managementReview,
                        escalate: false,
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
        const nextFiles =
            Array.from(
                event.target.files ?? []
            )
        setFiles(nextFiles)

        if (!nextFiles.length) {
            return
        }

        if (!navigator.onLine) {
            setSubmitError(
                'Evidence uploads require an online connection.'
            )
            return
        }

        setSubmitError('')

        try {
            for (const file of nextFiles) {
                await retryOperation(
                    () =>
                        uploadEvidenceMutation.mutateAsync(
                            {
                                id,
                                payload: {
                                    file,
                                    siteId:
                                        incident?.siteId,
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
        } catch (error) {
            setSubmitError(
                getErrorMessage(error)
            )
        }
    }

    if (incidentQuery.isLoading) {
        return (
            <AppLayout>
                <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm text-zinc-400">
                    Loading incident details...
                </div>
            </AppLayout>
        )
    }

    if (incidentQuery.isError || !incident) {
        return (
            <AppLayout>
                <div className="mx-auto max-w-6xl rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
                    Unable to load incident details.
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="mx-auto max-w-6xl space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        {incident.location}
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        {`${formatLabel(
                            incident.incidentType
                        )} | ${formatLabel(
                            incident.status
                        )} | ${formatDate(
                            incident.eventDate
                        )}`}
                    </p>
                </div>

                <div className="grid gap-8 xl:grid-cols-[1.35fr_1fr]">
                    <div className="space-y-8">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                            <h2 className="text-2xl font-bold">
                                Incident Summary
                            </h2>

                            <div className="mt-6 grid gap-4 text-sm text-zinc-300 md:grid-cols-2">
                                <p>
                                    Severity: {formatLabel(incident.severity)}
                                </p>
                                <p>
                                    Site: {incident.site?.name || 'Unassigned site'}
                                </p>
                                <p>
                                    Status: {formatLabel(incident.status)}
                                </p>
                                <p>
                                    Urgent: {incident.urgentFlag ? 'Yes' : 'No'}
                                </p>
                            </div>

                            <p className="mt-6 whitespace-pre-line text-sm text-zinc-300">
                                {incident.description}
                            </p>

                            {buildPeopleSummary(
                                incident.peopleInvolved
                            ).length ? (
                                <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                                    <h3 className="text-sm font-semibold text-white">
                                        Injury Tracking
                                    </h3>

                                    <div className="mt-3 space-y-2 text-sm text-zinc-300">
                                        {buildPeopleSummary(
                                            incident.peopleInvolved
                                        ).map(
                                            (
                                                person
                                            ) => (
                                                <p
                                                    key={
                                                        person.name
                                                    }
                                                >
                                                    {person.name}: {person.detail}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </div>
                            ) : null}

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                                    <h3 className="text-sm font-semibold text-white">
                                        Immediate Cause
                                    </h3>

                                    <p className="mt-2 text-sm text-zinc-300">
                                        {incident.immediateActions || 'Not recorded'}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                                    <h3 className="text-sm font-semibold text-white">
                                        Root Cause
                                    </h3>

                                    <p className="mt-2 text-sm text-zinc-300">
                                        {incident.rootCause || 'Not recorded'}
                                    </p>
                                </div>
                            </div>

                            {submitError ? (
                                <p className="mt-4 text-sm text-red-400">
                                    {submitError}
                                </p>
                            ) : null}

                            <div className="mt-6 flex flex-wrap gap-3">
                                {canSubmit ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleTransition(
                                                'submitted',
                                                'Incident submitted for review'
                                            )
                                        }
                                        className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
                                    >
                                        Submit Incident
                                    </button>
                                ) : null}

                                {canInvestigate &&
                                incident.status ===
                                    'submitted' ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleTransition(
                                                'under_review',
                                                'Investigation started'
                                            )
                                        }
                                        className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium hover:bg-white/[0.03]"
                                    >
                                        Start Investigation
                                    </button>
                                ) : null}

                                {canValidate ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleTransition(
                                                'validated',
                                                'Incident submitted to HQ review'
                                            )
                                        }
                                        className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium hover:bg-white/[0.03]"
                                    >
                                        Submit to HQ Review
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        <InvestigationAssignment
                            values={assignmentForm}
                            investigators={(
                                usersQuery.data
                                    ?.data ?? []
                            ).map((item) => ({
                                id: item.id,
                                fullName:
                                    [
                                        item.firstName,
                                        item.lastName,
                                    ]
                                        .filter(Boolean)
                                        .join(' ') ||
                                    item.email,
                            }))}
                            onChange={
                                updateAssignmentField
                            }
                            onAssign={
                                handleAssignInvestigator
                            }
                            disabled={
                                assignInvestigatorMutation.isPending
                            }
                            canAssign={
                                canInvestigate
                            }
                        />

                        <InvestigatorComments
                            values={commentForm}
                            onChange={
                                updateCommentField
                            }
                            onSave={
                                handleAddInvestigation
                            }
                            disabled={
                                addInvestigationMutation.isPending
                            }
                            canEdit={
                                canInvestigate
                            }
                        />

                        <ManagementReviewCard
                            value={
                                managementReview
                            }
                            onChange={
                                setManagementReview
                            }
                            onSave={
                                handleSaveManagementReview
                            }
                            disabled={
                                managementReviewMutation.isPending
                            }
                            canEdit={
                                canApprove
                            }
                        />

                        <IncidentApprovalPanel
                            status={
                                incident.status
                            }
                            onApprove={
                                handleApprove
                            }
                            onReject={
                                handleReject
                            }
                            onRequestRevision={() =>
                                handleTransition(
                                    'returned_for_correction',
                                    managementReview ||
                                        'Returned for correction'
                                )
                            }
                            onClose={
                                handleClose
                            }
                            disabled={
                                approveMutation.isPending ||
                                rejectMutation.isPending ||
                                closeMutation.isPending
                            }
                        />
                    </div>

                    <div className="space-y-8">
                        <InvestigationTimeline
                            items={timelineItems}
                        />

                        <EscalationPanel
                            incident={incident}
                            escalations={
                                incident.escalations ??
                                []
                            }
                        />

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                            <h2 className="text-2xl font-bold">
                                Linked CAPAs
                            </h2>

                            <div className="mt-6 space-y-3 text-sm text-zinc-300">
                                {capaQuery.data?.length ? (
                                    capaQuery.data.map(
                                        (
                                            item
                                        ) => (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                                            >
                                                <p className="font-medium text-white">
                                                    {item.title}
                                                </p>

                                                <p className="mt-1 text-zinc-400">
                                                    {formatLabel(
                                                        item.status
                                                    )} | Due {formatDate(
                                                        item.dueDate
                                                    )}
                                                </p>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <p className="text-zinc-400">
                                        No linked CAPAs found.
                                    </p>
                                )}
                            </div>
                        </div>

                        <IncidentEvidenceUpload
                            files={files}
                            attachments={
                                evidence
                            }
                            uploadProgress={
                                uploadProgress
                            }
                            onChange={
                                handleUpload
                            }
                            disabled={
                                incident.status ===
                                    'closed' ||
                                uploadEvidenceMutation.isPending
                            }
                            helperText="Upload images, PDFs, and videos."
                        />

                        {evidence.length ? (
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                                <h2 className="text-xl font-semibold">
                                    Evidence Files
                                </h2>

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
                                                    }
                                                </div>
                                            </a>
                                        )
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
