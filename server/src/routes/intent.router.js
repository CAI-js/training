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

/**
 * @swagger
 * path:
 *  /agents/{agentId}/domains/{domainId}/intents/{intentId}:
 *    get:
 *      summary: Get one intent
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
 *        - in: path
 *          name: intentId
 *          type: string
 *          required: true
 *          description: Identifier of the intent
 *      tags: [Intent]
 *      responses:
 *        "200":
 *          description: Intents of the agent
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Intent'
 *        "401":
 *          description: You have no access
 *        "404":
 *          description: Intent not found
 */
router.get(routeDomainId, ensureAuthenticated, controller.findIntentById);

/**
 * @swagger
 * path:
 *  /agents/{agentId}/intents/{intentId}:
 *    get:
 *      summary: Get one intent
 *      parameters:
 *        - in: path
 *          name: agentId
 *          type: string
 *          required: true
 *          description: Identifier of the agent
 *        - in: path
 *          name: intentId
 *          type: string
 *          required: true
 *          description: Identifier of the intent
 *      tags: [Intent]
 *      responses:
 *        "200":
 *          description: Intents of the agent
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Intent'
 *        "401":
 *          description: You have no access
 *        "404":
 *          description: Intent not found
 */
router.get(routeId, ensureAuthenticated, controller.findIntentById);

/**
 * @swagger
 * path:
 *  /agents/{agentId}/intents:
 *    post:
 *      summary: Insert a new intent for an agent
 *      parameters:
 *        - in: path
 *          name: agentId
 *          type: string
 *          required: true
 *          description: Identifier of the agent
 *      tags: [Intent]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Intent'
 *      responses:
 *        "200":
 *          description: Intents of the agent
 *          content:
 *            application/json:
 *              schema:
*                  $ref: '#/components/schemas/Intent'
 *        "400":
 *          description: Domain id is mandatory
 *        "401":
 *          description: You have no access
 *        "404":
 *          description: Domain not found
 *        "409":
 *          description: Intent with same tag already exists in this domain
 */
router.post(route, ensureAuthenticated, controller.createIntent);

/**
 * @swagger
 * path:
 *  /agents/{agentId}/intents/{intentId}:
 *    put:
 *      summary: Modify an existing intent
 *      parameters:
 *        - in: path
 *          name: agentId
 *          type: string
 *          required: true
 *          description: Identifier of the agent
 *        - in: path
 *          name: intentId
 *          type: string
 *          required: true
 *          description: Identifier of the intent
 *      tags: [Intent]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Intent'
 *      responses:
 *        "200":
 *          description: Intents of the agent
 *          content:
 *            application/json:
 *              schema:
*                  $ref: '#/components/schemas/Intent'
 *        "400":
 *          description: Intent id is mandatory
 *        "401":
 *          description: You have no access
 *        "404":
 *          description: Intent not found
 */
router.put(routeId, ensureAuthenticated, controller.updateIntent);

/**
 * @swagger
 * path:
 *  /agents/{agentId}/intents/{intentId}:
 *    delete:
 *      summary: Remove an existing intent
 *      parameters:
 *        - in: path
 *          name: agentId
 *          type: string
 *          required: true
 *          description: Identifier of the agent
 *        - in: path
 *          name: intentId
 *          type: string
 *          required: true
 *          description: Identifier of the intent
 *      tags: [Intent]
 *      responses:
 *        "200":
 *          description: Intents of the agent
 *          content:
 *            application/json:
 *              schema:
*                  $ref: '#/components/schemas/Intent'
 *        "400":
 *          description: Intent id is mandatory
 *        "401":
 *          description: You have no access
 *        "404":
 *          description: Intent not found
 */
router.delete(routeId, ensureAuthenticated, controller.deleteIntent);
module.exports = router;
