import AppLayout from '../../components/layouts/AppLayout'
import { useParams } from 'react-router-dom'

import InvestigationAssignment from '../../components/investigations/InvestigationAssignment'
import InvestigatorComments from '../../components/investigations/InvestigatorComments'
import InvestigationTimeline from '../../components/investigations/InvestigationTimeline'
import IncidentApprovalPanel from '../../components/investigations/IncidentApprovalPanel'
import EscalationPanel from '../../components/investigations/EscalationPanel'
import ManagementReviewCard from '../../components/investigations/ManagementReviewCard'
import {
    useIncident,
} from '../../hooks/useIncidents'
import {
    formatDate,
    formatLabel,
} from '../../utils/formatters'

export default function IncidentDetailsPage() {
    const { id } = useParams()
    const { data } = useIncident(id)
    const incident = data?.incident

    return (
        <AppLayout>

            <div className="mx-auto max-w-6xl space-y-8">

                <div>
                    <h1 className="text-3xl font-bold">
                        {incident?.location ??
                            'Incident Investigation'}
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        {incident
                            ? `${formatLabel(
                                  incident.incidentType
                              )} · ${formatLabel(
                                  incident.status
                              )} · ${formatDate(
                                  incident.eventDate
                              )}`
                            : 'Investigation workflow and compliance review'}
                    </p>
                </div>

                <InvestigationAssignment />

                <InvestigatorComments />

                <div className="grid gap-8 xl:grid-cols-2">

                    <InvestigationTimeline />

                    <EscalationPanel />
                </div>

                <ManagementReviewCard />

                <IncidentApprovalPanel />
            </div>
        </AppLayout>
    )
}
