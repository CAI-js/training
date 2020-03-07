const express = require('express');
const controller = require('../controllers/domain.controller');
const { ensureAuthenticated } = require('../core/auth');

const route = '/agents/:agentId/domains';
const routeId = '/agents/:agentId/domains/:domainId';

const router = express.Router();
router.get(route, ensureAuthenticated, controller.findDomains);
router.post(route, ensureAuthenticated, controller.createDomain);
router.get(routeId, ensureAuthenticated, controller.findDomainById);
router.put(routeId, ensureAuthenticated, controller.updateDomain);
router.delete(routeId, ensureAuthenticated, controller.deleteDomain);
module.exports = router;
