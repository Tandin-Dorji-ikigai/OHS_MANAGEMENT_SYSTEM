const express = require('express');
const siteController = require('../controllers/siteController');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const { siteSchema, siteUpdateSchema } = require('../validators/siteValidator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authenticate);
router.get('/', siteController.listSites);
router.post('/', authorizeRoles(ROLES.HQ_SAFETY_OFFICER), validate(siteSchema), siteController.createSite);
router.patch('/:id', authorizeRoles(ROLES.HQ_SAFETY_OFFICER), validate(siteUpdateSchema), siteController.updateSite);

module.exports = router;
