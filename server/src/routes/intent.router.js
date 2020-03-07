const express = require('express');
const controller = require('../controllers/intent.controller');
const { ensureAuthenticated } = require('../core/auth');

const route = '/agents/:agentId/intents';
const routeId = '/agents/:agentId/intents/:intentId';
const routeDomain = '/agents/:agentId/domains/:domainId/intents';
const routeDomainId = '/agents/:agentId/domains/:domainId/intents/:intentId';

const router = express.Router();
router.get(routeDomain, ensureAuthenticated, controller.findIntents);
router.get(route, ensureAuthenticated, controller.findIntents);
router.get(routeDomainId, ensureAuthenticated, controller.findIntentById);
router.get(routeId, ensureAuthenticated, controller.findIntentById);
router.post(route, controller.createIntent);
router.put(routeId, controller.updateIntent);
router.delete(routeId, controller.deleteIntent);
module.exports = router;
