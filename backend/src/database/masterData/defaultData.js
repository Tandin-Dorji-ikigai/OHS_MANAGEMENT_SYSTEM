const {
  userIds,
  roleIds,
  siteIds,
  userSiteIds,
  inspectionIds,
  inspectionItemIds,
  inspectionFindingIds,
  incidentIds,
  incidentInvestigationIds,
  riskAssessmentIds,
  riskItemIds,
  trainingIds,
  toolboxMeetingIds,
  activityIds,
  planIds,
  correctiveActionIds,
  notificationIds
} = require('./ids');

const withTimestamps = (record, now) => ({
  ...record,
  createdAt: now,
  updatedAt: now
});

const getDefaultData = ({ now = new Date(), passwordHash }) => ({
  users: [
    withTimestamps(
      {
        id: userIds.hq,
        roleId: roleIds.hq,
        firstName: 'Aum',
        lastName: 'Dorji',
        email: 'hq.safety@demo.local',
        phoneNumber: '+97517110001',
        employeeCode: 'EMP-HQ-001',
        passwordHash,
        department: 'Safety and Compliance',
        teamName: 'HQ Safety',
        isActive: true
      },
      now
    ),
    withTimestamps(
      {
        id: userIds.field,
        roleId: roleIds.field,
        firstName: 'Karma',
        lastName: 'Wangdi',
        email: 'field.safety@demo.local',
        phoneNumber: '+97517110002',
        employeeCode: 'EMP-FLD-002',
        passwordHash,
        department: 'Field Safety',
        teamName: 'Regional West',
        isActive: true
      },
      now
    ),
    withTimestamps(
      {
        id: userIds.supervisor,
        roleId: roleIds.supervisor,
        firstName: 'Sonam',
        lastName: 'Choden',
        email: 'supervisor@demo.local',
        phoneNumber: '+97517110003',
        employeeCode: 'EMP-SUP-003',
        passwordHash,
        department: 'Operations',
        teamName: 'Plant Safety',
        isActive: true
      },
      now
    ),
    withTimestamps(
      {
        id: userIds.management,
        roleId: roleIds.management,
        firstName: 'Tashi',
        lastName: 'Namgay',
        email: 'management@demo.local',
        phoneNumber: '+97517110004',
        employeeCode: 'EMP-MGT-004',
        passwordHash,
        department: 'Executive Office',
        teamName: 'Leadership',
        isActive: true
      },
      now
    )
  ],
  userSites: [
    withTimestamps({ id: userSiteIds.hqPrimary, userId: userIds.hq, siteId: siteIds.hq, isPrimary: true }, now),
    withTimestamps({ id: userSiteIds.hqPlant, userId: userIds.hq, siteId: siteIds.plant, isPrimary: false }, now),
    withTimestamps({ id: userSiteIds.hqMine, userId: userIds.hq, siteId: siteIds.mine, isPrimary: false }, now),
    withTimestamps({ id: userSiteIds.fieldPlant, userId: userIds.field, siteId: siteIds.plant, isPrimary: true }, now),
    withTimestamps({ id: userSiteIds.fieldMine, userId: userIds.field, siteId: siteIds.mine, isPrimary: false }, now),
    withTimestamps({ id: userSiteIds.supervisorPlant, userId: userIds.supervisor, siteId: siteIds.plant, isPrimary: true }, now),
    withTimestamps({ id: userSiteIds.managementHq, userId: userIds.management, siteId: siteIds.hq, isPrimary: true }, now)
  ],
  inspections: [
    withTimestamps(
      {
        id: inspectionIds.approvedPpe,
        title: 'Weekly PPE Compliance Inspection',
        siteId: siteIds.plant,
        scheduleDate: '2026-04-08',
        inspectionDate: '2026-04-09',
        templateName: 'General Plant Safety',
        status: 'approved',
        observations: 'Most production lines were compliant.',
        recommendations: 'Improve storage discipline in the raw materials bay.',
        complianceScore: 84.62,
        submittedAt: now,
        validatedAt: now,
        approvedAt: now,
        createdBy: userIds.supervisor,
        approvedBy: userIds.hq
      },
      now
    ),
    withTimestamps(
      {
        id: inspectionIds.pendingHousekeeping,
        title: 'Monthly Housekeeping Inspection',
        siteId: siteIds.mine,
        scheduleDate: '2026-04-12',
        inspectionDate: '2026-04-13',
        templateName: 'Quarry Housekeeping',
        status: 'submitted',
        observations: 'Fuel storage area needs improved bund drainage.',
        recommendations: 'Clear debris near access route and repaint walkway lines.',
        complianceScore: 72.5,
        submittedAt: now,
        createdBy: userIds.supervisor
      },
      now
    )
  ],
  inspectionItems: [
    withTimestamps(
      {
        id: inspectionItemIds.ppeCompliant,
        inspectionId: inspectionIds.approvedPpe,
        checklistText: 'All personnel wearing required PPE',
        isCompliant: true,
        comments: 'Observed full compliance on line 1 and 2',
        sortOrder: 1
      },
      now
    ),
    withTimestamps(
      {
        id: inspectionItemIds.missingLabels,
        inspectionId: inspectionIds.approvedPpe,
        checklistText: 'Chemical storage labels visible and current',
        isCompliant: false,
        comments: 'Two containers missing updated labels',
        sortOrder: 2
      },
      now
    ),
    withTimestamps(
      {
        id: inspectionItemIds.housekeepingZone,
        inspectionId: inspectionIds.pendingHousekeeping,
        checklistText: 'Walkways and access routes are free from obstruction',
        isCompliant: false,
        comments: 'Loose packing material found near the loading ramp',
        sortOrder: 1
      },
      now
    )
  ],
  inspectionFindings: [
    withTimestamps(
      {
        id: inspectionFindingIds.labelNonConformance,
        inspectionId: inspectionIds.approvedPpe,
        title: 'Chemical label non-conformance',
        description: 'Intermediate storage drums lacked revision 2026 labels.',
        recommendation: 'Replace labels and add label verification to shift start checks.',
        priority: 'high',
        actionRequired: true
      },
      now
    ),
    withTimestamps(
      {
        id: inspectionFindingIds.openHousekeeping,
        inspectionId: inspectionIds.pendingHousekeeping,
        title: 'Open housekeeping issue',
        description: 'Discarded packaging is blocking part of the marked pedestrian path.',
        recommendation: 'Assign the shift team to clear the route before next dispatch window.',
        priority: 'medium',
        actionRequired: true
      },
      now
    )
  ],
  incidents: [
    withTimestamps(
      {
        id: incidentIds.forkliftNearMiss,
        siteId: siteIds.plant,
        incidentType: 'near_miss',
        severity: 'moderate',
        eventDate: '2026-04-10T09:20:00Z',
        location: 'Packing Line 2',
        peopleInvolved: [{ name: 'Operator Pema', role: 'Operator' }],
        description: 'Forklift reversed into a pedestrian path without horn warning.',
        immediateActions: 'Area isolated and operator briefed.',
        rootCause: 'Blind spot controls and pedestrian barrier discipline were weak.',
        status: 'validated',
        urgentFlag: false,
        submittedAt: now,
        validatedAt: now,
        createdBy: userIds.supervisor
      },
      now
    ),
    withTimestamps(
      {
        id: incidentIds.quarryInjury,
        siteId: siteIds.mine,
        incidentType: 'accident',
        severity: 'major',
        eventDate: '2026-04-05T07:45:00Z',
        location: 'Bench 3 Access Road',
        peopleInvolved: [{ name: 'Driver Tshering', role: 'Haul Truck Driver' }],
        description: 'A haul truck slipped during wet conditions and the driver sustained a lost-time injury.',
        immediateActions: 'Emergency response mobilized and route traffic halted.',
        rootCause: 'Inadequate traction management and delayed berm inspection.',
        status: 'approved',
        urgentFlag: true,
        submittedAt: now,
        validatedAt: now,
        approvedAt: now,
        createdBy: userIds.field,
        approvedBy: userIds.hq
      },
      now
    )
  ],
  incidentInvestigations: [
    withTimestamps(
      {
        id: incidentInvestigationIds.forkliftNearMiss,
        incidentId: incidentIds.forkliftNearMiss,
        investigatorId: userIds.field,
        investigationDate: '2026-04-10',
        findings: 'Spotter controls were not enforced during reverse movement.',
        rootCauseAnalysis: 'Insufficient route demarcation and refresher training gaps.',
        recommendations: 'Install convex mirror and retrain forklift operators.'
      },
      now
    ),
    withTimestamps(
      {
        id: incidentInvestigationIds.quarryInjury,
        incidentId: incidentIds.quarryInjury,
        investigatorId: userIds.field,
        investigationDate: '2026-04-06',
        findings: 'Surface drainage allowed water accumulation at a critical turning point.',
        rootCauseAnalysis: 'Pre-shift inspection escalation did not reach site leadership in time.',
        recommendations: 'Upgrade drainage channels, refresh route risk assessment, and enforce weather-triggered traffic control.'
      },
      now
    )
  ],
  riskAssessments: [
    withTimestamps(
      {
        id: riskAssessmentIds.quarryBlasting,
        siteId: siteIds.mine,
        title: 'Quarry Drilling and Blasting',
        jobTask: 'Bench preparation and blast setup',
        version: 2,
        status: 'approved',
        assessmentDate: '2026-04-01',
        nextReviewDate: '2026-07-01',
        createdBy: userIds.field,
        approvedBy: userIds.hq
      },
      now
    )
  ],
  riskItems: [
    withTimestamps(
      {
        id: riskItemIds.flyRock,
        riskAssessmentId: riskAssessmentIds.quarryBlasting,
        hazard: 'Fly rock during detonation',
        consequence: 'Severe injury to personnel or nearby equipment damage',
        likelihood: 3,
        severity: 4,
        riskScore: 12,
        riskLevel: 'high',
        controlMeasures: 'Extend exclusion zone and verify blast mats before firing.',
        responsiblePerson: 'Site Blasting Supervisor'
      },
      now
    ),
    withTimestamps(
      {
        id: riskItemIds.dustExposure,
        riskAssessmentId: riskAssessmentIds.quarryBlasting,
        hazard: 'Respirable silica dust exposure',
        consequence: 'Respiratory health impact over prolonged exposure',
        likelihood: 3,
        severity: 3,
        riskScore: 9,
        riskLevel: 'medium',
        controlMeasures: 'Water suppression and respiratory protection compliance checks.',
        responsiblePerson: 'Field Safety Officer'
      },
      now
    )
  ],
  trainings: [
    withTimestamps(
      {
        id: trainingIds.forkliftRefresher,
        siteId: siteIds.plant,
        title: 'Forklift and Pedestrian Interface Refresher',
        topic: 'Vehicle movement controls',
        trainerName: 'Pema Safety Consulting',
        trainingDate: '2026-04-11',
        attendeeCount: 24,
        attendees: [{ name: 'Operator Pema' }, { name: 'Storekeeper Leki' }],
        status: 'approved',
        createdBy: userIds.field
      },
      now
    )
  ],
  toolboxMeetings: [
    withTimestamps(
      {
        id: toolboxMeetingIds.weeklyToolbox,
        siteId: siteIds.plant,
        topic: 'Chemical handling and pedestrian route discipline',
        facilitator: 'Sonam Choden',
        meetingDate: '2026-04-14',
        attendees: [{ name: 'Shift A Crew' }, { name: 'Warehouse Team' }],
        notes: 'Focused on visibility, horn use, and chemical label checks.',
        status: 'submitted',
        createdBy: userIds.supervisor
      },
      now
    )
  ],
  ohsActivities: [
    withTimestamps(
      {
        id: activityIds.awarenessSession,
        siteId: siteIds.hq,
        activityType: 'awareness_session',
        title: 'Corporate Safety Awareness Week Launch',
        activityDate: '2026-04-02',
        summary: 'Leadership kickoff session covering reporting discipline and safe work planning.',
        status: 'approved',
        createdBy: userIds.hq
      },
      now
    )
  ],
  ohsPlans: [
    withTimestamps(
      {
        id: planIds.annualPlan,
        siteId: siteIds.hq,
        title: '2026 OHS Improvement Plan',
        year: 2026,
        objective: 'Reduce high-severity incidents while improving inspection closure discipline across all sites.',
        targetMetric: '10% reduction in overdue corrective actions',
        ownerName: 'Aum Dorji',
        dueDate: '2026-12-31',
        progressPercent: 37.5,
        status: 'submitted',
        createdBy: userIds.hq
      },
      now
    )
  ],
  correctiveActions: [
    withTimestamps(
      {
        id: correctiveActionIds.relabelDrums,
        title: 'Relabel chemical drums in storage bay',
        description: 'Replace outdated labels and verify revision control for all drums in the raw materials bay.',
        sourceModule: 'inspection',
        sourceRecordId: inspectionIds.approvedPpe,
        siteId: siteIds.plant,
        assignedTo: userIds.supervisor,
        priority: 'high',
        dueDate: '2026-04-12',
        status: 'overdue',
        createdBy: userIds.hq
      },
      now
    ),
    withTimestamps(
      {
        id: correctiveActionIds.walkwayBarrier,
        title: 'Install barrier and warning mirror on packing line crossing',
        description: 'Improve vehicle-pedestrian separation on Packing Line 2 after the near miss.',
        sourceModule: 'incident',
        sourceRecordId: incidentIds.forkliftNearMiss,
        siteId: siteIds.plant,
        assignedTo: userIds.field,
        priority: 'critical',
        dueDate: '2026-04-20',
        status: 'in_progress',
        createdBy: userIds.field
      },
      now
    )
  ],
  notifications: [
    withTimestamps(
      {
        id: notificationIds.inspectionSubmitted,
        userId: userIds.field,
        title: 'Inspection submitted for review',
        message: 'Monthly Housekeeping Inspection has been submitted and is waiting for regional review.',
        type: 'submission_created',
        moduleName: 'inspection',
        recordId: inspectionIds.pendingHousekeeping,
        isRead: false
      },
      now
    ),
    withTimestamps(
      {
        id: notificationIds.overdueAction,
        userId: userIds.hq,
        title: 'Corrective action overdue',
        message: 'Relabel chemical drums in storage bay is overdue and needs escalation.',
        type: 'overdue_action',
        moduleName: 'corrective_action',
        recordId: correctiveActionIds.relabelDrums,
        isRead: false
      },
      now
    )
  ]
});

module.exports = {
  getDefaultData
};
