const express = require('express');
const controller = require('../controllers/domain.controller');
const { ensureAuthenticated } = require('../core/auth');

/**
 * @swagger
 * tags:
 *   name: Domain
 *   description: Domain management
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      Domain:
 *        type: object
 *        required:
 *          - name
 *          - tag
 *          - agentId
 *          - language
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the domain
 *          tag:
 *            type: string
 *            description: Unique tag of the domain calculated from the name.
 *          agentId:
 *            type: string
 *            description: Identifier of the agent
 *          language:
 *            type: string
 *            description: Language locale
 *        example:
 *           name: Demo Domain
 *           tag: demo_domain
 *           agentId: 5e592e53ee2f9d29ece20060
 *           language: en
 */

const route = '/agents/:agentId/domains';
const routeId = '/agents/:agentId/domains/:domainId';

const router = express.Router();

/**
 * @swagger
 * path:
 *  /agents/{agentId}/domains:
 *    get:
 *      summary: Get all the domains of an agent
 *      parameters:
 *        - in: path
 *          name: agentId
 *          type: string
 *          required: true
 *          description: Identifier of the agent
 *      tags: [Domain]
 *      responses:
 *        "200":
 *          description: Domains of the agent
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Domain'
 *        "401":
 *          description: You have no access
 */
router.get(route, ensureAuthenticated, controller.findDomains);

/**
 * @swagger
 * path:
 *  /agents/{agentId}/domains:
 *    post:
 *      summary: Insert a new domain for an agent
 *      parameters:
 *        - in: path
 *          name: agentId
 *          type: string
 *          required: true
 *          description: Identifier of the agent
 *      tags: [Domain]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Domain'
 *      responses:
 *        "200":
 *          description: The domain is created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Domain'
 *        "401":
 *          description: You have no access
 *        "409":
 *          description: Domain with same tag already exists
 */
router.post(route, ensureAuthenticated, controller.createDomain);

/**
 * @swagger
 * path:
 *  /agents/{agentId}/domains/{domainId}:
 *    get:
 *      summary: Get one domain
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
 *      tags: [Domain]
 *      responses:
 *        "200":
 *          description: Get one domain
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Domain'
 *        "401":
 *          description: You have no access
 */
router.get(routeId, ensureAuthenticated, controller.findDomainById);

/**
 * @swagger
 * path:
 *  /agents/{agentId}/domains/{domainId}:
 *    put:
 *      summary: Modify an existing domain
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
 *      tags: [Domain]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Domain'
 *      responses:
 *        "200":
 *          description: Update one domain
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Domain'
 *        "401":
 *          description: You have no access
 */
router.put(routeId, ensureAuthenticated, controller.updateDomain);

/**
 * @swagger
 * path:
 *  /agents/{agentId}/domains/{domainId}:
 *    delete:
 *      summary: Remove an existing domain
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
 *      tags: [Domain]
 *      responses:
 *        "200":
 *          description: Domain is removed
 *        "401":
 *          description: You have no access
 */
router.delete(routeId, ensureAuthenticated, controller.deleteDomain);
module.exports = router;
