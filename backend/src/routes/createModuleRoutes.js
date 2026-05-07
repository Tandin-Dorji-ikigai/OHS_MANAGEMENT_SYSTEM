const express = require('express');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const createModuleRoutes = (controller, schemas) => {
  const router = express.Router();

  router.use(authenticate);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', validate(schemas.create), controller.create);
  router.patch('/:id', validate(schemas.update), controller.update);
  router.post('/:id/transition', validate(schemas.transition), controller.transition);
  router.delete('/:id', controller.remove);

  return router;
};

module.exports = createModuleRoutes;
