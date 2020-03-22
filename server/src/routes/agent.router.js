const express = require('express');
const controller = require('../controllers/agent.controller');
const { ensureAuthenticated } = require('../core/auth');

/**
 * @swagger
 * tags:
 *   name: Agent
 *   description: Agent management
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      Agent:
 *        type: object
 *        required:
 *          - name
 *          - tag
 *          - description
 *          - owner
 *          - writers
 *          - readers
 *          - status
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the agent
 *          tag:
 *            type: string
 *            description: Unique tag of the agent calculated from the name.
 *          description:
 *            type: string
 *            description: Description of the agent
 *          owner:
 *            type: string
 *            format: email
 *            description: Email of the owner of the bot
 *          readers:
 *            type: array
 *            description: Emails of the users that can read the bot
 *            items:
 *              type: string
 *              format: email
 *          writers:
 *            type: array
 *            description: Emails of the users that can write the bot
 *            items:
 *               type: string
 *               format: email
 *          status:
 *            type: string
 *            description: Status of the bot
 *        example:
 *           name: Demo Agent
 *           tag: demo_agent
 *           description: A demo agent for testing purposes
 *           owner: anna@email.com
 *           readers: [bob@email.com, cat@email.com]
 *           writers: [dean@email.com, emily@email.com]
 *           status: Ready
 */

const route = '/agents';
const routeId = '/agents/:agentId';

const router = express.Router();

/**
 * @swagger
 * path:
 *  /agents:
 *    get:
 *      summary: Get all the agents
 *      tags: [Agent]
 *      responses:
 *        "200":
 *          description: An array of agents
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Agent'
 *        "401":
 *          description: You have no access
 */
router.get(route, ensureAuthenticated, controller.findAllAgents);

/**
 * @swagger
 * path:
 *  /agents/{agentId}:
 *    get:
 *      summary: Get an agent by id
 *      parameters:
 *        - in: path
 *          name: agentId
 *          type: string
 *          required: true
 *          description: Identifier of the agent
 *      tags: [Agent]
 *      responses:
 *        "200":
 *          description: An Agent
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Agent'
 *        "401":
 *          description: You have no access
 */
router.get(routeId, ensureAuthenticated, controller.findAgentById);

/**
 * @swagger
 * path:
 *  /agents:
 *    post:
 *      summary: Create a new agent
 *      tags: [Agent]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Agent'
 *      responses:
 *        "200":
 *          description: The agent created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Agent'
 *        "401":
 *          description: You have no access
 *        "400":
 *          description: Agent name is mandatory
 *        "409":
 *          description: Agent with same tag already exists
 */
router.post(route, ensureAuthenticated, controller.createAgent);

/**
 * @swagger
 * path:
 *  /agents/{agentId}:
 *    put:
 *      summary: Modify an existing agent
 *      tags: [Agent]
 *      parameters:
 *        - in: path
 *          name: agentId
 *          type: string
 *          required: true
 *          description: Identifier of the agent
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Agent'
 *      responses:
 *        "200":
 *          description: The agent modified
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Agent'
 *        "401":
 *          description: You have no access
 *        "400":
 *          description: Agent name is mandatory
 *        "409":
 *          description: Agent with same tag already exists
 */
router.put(routeId, ensureAuthenticated, controller.updateAgent);
/**
 * @swagger
 * path:
 *  /agents/{agentId}:
 *    delete:
 *      summary: Remove an existing agent
 *      tags: [Agent]
 *      parameters:
 *        - in: path
 *          name: agentId
 *          type: string
 *          required: true
 *          description: Identifier of the agent
 *      responses:
 *        "200":
 *          description: The agent is deleted
 *        "401":
 *          description: You have no access
 */
router.delete(routeId, ensureAuthenticated, controller.deleteAgent);
module.exports = router;
