const express = require('express');
const controller = require('../controllers/intent.controller');
const { ensureAuthenticated } = require('../core/auth');

/**
 * @swagger
 * tags:
 *   name: Intent
 *   description: Intent management
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      Intent:
 *        type: object
 *        required:
 *          - name
 *          - tag
 *          - agentId
 *          - domainId
 *          - utterances
 *          - answers
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the intent
 *          tag:
 *            type: string
 *            description: Unique tag of the intent calculated from the name.
 *          agentId:
 *            type: string
 *            description: Identifier of the agent
 *          domainId:
 *            type: string
 *            description: Identifier of the domain
 *          utterances:
 *            type: array
 *            items:
 *              type: string
 *            description: Utterances for training the intent
 *          answers:
 *            type: array
 *            items:
 *              type: string
 *            description: Answers for the intents
 *        example:
 *           name: Demo Intent
 *           tag: demo_intent
 *           agentId: 5e592e53ee2f9d29ece20060
 *           domainId: 5e592e53ee2f9d29ece21342
 *           utterances: ["Who are you", "Are you a chatbot"]
 *           answers: ["I'm a conversational app"]
 */

const route = '/agents/:agentId/intents';
const routeId = '/agents/:agentId/intents/:intentId';
const routeDomain = '/agents/:agentId/domains/:domainId/intents';
const routeDomainId = '/agents/:agentId/domains/:domainId/intents/:intentId';

const router = express.Router();

/**
 * @swagger
 * path:
 *  /agents/{agentId}/domains/{domainId}/intents:
 *    get:
 *      summary: Get all the intents of a domain
 *      parameters:
 *        - in: path
 *          name: agentId
 *          type: string
 *          required: true
 *          description: Identifier of the agent
 *        - in: path
 *          name: domainId
 *          type: string
 *          required: true
 *          description: Identifier of the domain
 *      tags: [Intent]
 *      responses:
 *        "200":
 *          description: Intents of the domain
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Intent'
 *        "401":
 *          description: You have no access
 */
router.get(routeDomain, ensureAuthenticated, controller.findIntents);

/**
 * @swagger
 * path:
 *  /agents/{agentId}/intents:
 *    get:
 *      summary: Get all the intents of an agent
 *      parameters:
 *        - in: path
 *          name: agentId
 *          type: string
 *          required: true
 *          description: Identifier of the agent
 *      tags: [Intent]
 *      responses:
 *        "200":
 *          description: Intents of the agent
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Intent'
 *        "401":
 *          description: You have no access
 */
router.get(route, ensureAuthenticated, controller.findIntents);

router.get(routeDomainId, ensureAuthenticated, controller.findIntentById);
router.get(routeId, ensureAuthenticated, controller.findIntentById);
router.post(route, controller.createIntent);
router.put(routeId, controller.updateIntent);
router.delete(routeId, controller.deleteIntent);
module.exports = router;
