const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const { createUserSchema, updateUserSchema } = require('../validators/userValidator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authenticate, authorizeRoles(ROLES.HQ_SAFETY_OFFICER));
router.get('/options', userController.getUserOptions);
router.get('/', userController.listUsers);
router.post('/', validate(createUserSchema), userController.createUser);
router.patch('/:id', validate(updateUserSchema), userController.updateUser);

module.exports = router;
