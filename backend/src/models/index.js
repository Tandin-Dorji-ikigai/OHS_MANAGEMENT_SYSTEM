const sequelize = require('../config/database');

const Role = require('./Role')(sequelize);
const User = require('./User')(sequelize);
const Site = require('./Site')(sequelize);
const UserSite = require('./UserSite')(sequelize);
const RefreshToken = require('./RefreshToken')(sequelize);
const Notification = require('./Notification')(sequelize);
const ApprovalLog = require('./ApprovalLog')(sequelize);
const AuditLog = require('./AuditLog')(sequelize);
const Attachment = require('./Attachment')(sequelize);
const Inspection = require('./Inspection')(sequelize);
const InspectionItem = require('./InspectionItem')(sequelize);
const InspectionFinding = require('./InspectionFinding')(sequelize);
const Incident = require('./Incident')(sequelize);
const IncidentInvestigation = require('./IncidentInvestigation')(sequelize);
const IncidentEscalation = require('./IncidentEscalation')(sequelize);
const RiskAssessment = require('./RiskAssessment')(sequelize);
const RiskItem = require('./RiskItem')(sequelize);
const Training = require('./Training')(sequelize);
const ToolboxMeeting = require('./ToolboxMeeting')(sequelize);
const OhsActivity = require('./OhsActivity')(sequelize);
const OhsPlan = require('./OhsPlan')(sequelize);
const CorrectiveAction = require('./CorrectiveAction')(sequelize);

Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
User.belongsToMany(Site, { through: UserSite, foreignKey: 'userId', otherKey: 'siteId', as: 'sites' });
Site.belongsToMany(User, { through: UserSite, foreignKey: 'siteId', otherKey: 'userId', as: 'users' });

RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ApprovalLog.belongsTo(User, { foreignKey: 'actionBy', as: 'actor' });
AuditLog.belongsTo(User, { foreignKey: 'actionBy', as: 'actor' });
Attachment.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });
Attachment.belongsTo(Site, { foreignKey: 'siteId', as: 'site' });

Inspection.belongsTo(Site, { foreignKey: 'siteId', as: 'site' });
Inspection.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Inspection.hasMany(InspectionItem, { foreignKey: 'inspectionId', as: 'items' });
Inspection.hasMany(InspectionFinding, { foreignKey: 'inspectionId', as: 'findings' });
InspectionItem.belongsTo(Inspection, { foreignKey: 'inspectionId', as: 'inspection' });
InspectionFinding.belongsTo(Inspection, { foreignKey: 'inspectionId', as: 'inspection' });

Incident.belongsTo(Site, { foreignKey: 'siteId', as: 'site' });
Incident.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Incident.belongsTo(User, { foreignKey: 'assignedInvestigatorId', as: 'assignedInvestigator' });
Incident.belongsTo(User, { foreignKey: 'managementReviewedBy', as: 'managementReviewer' });
Incident.hasMany(IncidentInvestigation, { foreignKey: 'incidentId', as: 'investigations' });
Incident.hasMany(IncidentEscalation, { foreignKey: 'incidentId', as: 'escalations' });
IncidentInvestigation.belongsTo(Incident, { foreignKey: 'incidentId', as: 'incident' });
IncidentInvestigation.belongsTo(User, { foreignKey: 'investigatorId', as: 'investigator' });
IncidentEscalation.belongsTo(Incident, { foreignKey: 'incidentId', as: 'incident' });
IncidentEscalation.belongsTo(User, { foreignKey: 'triggeredBy', as: 'triggeredByUser' });

RiskAssessment.belongsTo(Site, { foreignKey: 'siteId', as: 'site' });
RiskAssessment.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
RiskAssessment.hasMany(RiskItem, { foreignKey: 'riskAssessmentId', as: 'items' });
RiskItem.belongsTo(RiskAssessment, { foreignKey: 'riskAssessmentId', as: 'assessment' });

Training.belongsTo(Site, { foreignKey: 'siteId', as: 'site' });
Training.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
ToolboxMeeting.belongsTo(Site, { foreignKey: 'siteId', as: 'site' });
ToolboxMeeting.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
OhsActivity.belongsTo(Site, { foreignKey: 'siteId', as: 'site' });
OhsActivity.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
OhsPlan.belongsTo(Site, { foreignKey: 'siteId', as: 'site' });
OhsPlan.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
CorrectiveAction.belongsTo(Site, { foreignKey: 'siteId', as: 'site' });
CorrectiveAction.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
CorrectiveAction.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = {
  sequelize,
  Role,
  User,
  Site,
  UserSite,
  RefreshToken,
  Notification,
  ApprovalLog,
  AuditLog,
  Attachment,
  Inspection,
  InspectionItem,
  InspectionFinding,
  Incident,
  IncidentInvestigation,
  IncidentEscalation,
  RiskAssessment,
  RiskItem,
  Training,
  ToolboxMeeting,
  OhsActivity,
  OhsPlan,
  CorrectiveAction
};
