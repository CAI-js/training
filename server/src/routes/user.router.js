const express = require('express');
const { login, register, refresh } = require('../controllers/user.controller');
const { ensureAuthenticated } = require('../core/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth management
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          password:
 *            type: string
 *            description: Password for the user
 *        example:
 *           name: Anna
 *           email: anna@email.com
 *           password: unicorn123
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      UserLogin:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          password:
 *            type: string
 *            description: Password for the user
 *        example:
 *           email: anna@email.com
 *           password: unicorn123
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      AuthToken:
 *        type: object
 *        required:
 *          - token
 *          - refreshToken
 *        properties:
 *          token:
 *            type: string
 *            description: Authorization bearer token.
 *          refreshToken:
 *            type: string
 *            description: Refresh token.
 *        example:
 *           token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZTdmZmFiOC0wM2RlLWNkZTEtNDVjMy03ZWE5YTJmNjFlNTYiLCJlbWFpbCI6ImpzZWlqYXNAZ21haWwuY29tIiwiaWF0IjoxNTgzMzQ5MDU0LCJleHAiOjE1ODMzNDkxMTR9.ftDxHN-EqBMIqxatjjyYwfD_l2wKBaiJO1lTE9DPTX8
 *           refreshToken: 9ea97d38-873a-b680-a236-16feb6bd4590
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      AuthRefresh:
 *        type: object
 *        required:
 *          - email
 *          - refreshToken
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          refreshToken:
 *            type: string
 *            description: Refresh token.
 *        example:
 *           email: anna@email.com
 *           refreshToken: 9ea97d38-873a-b680-a236-16feb6bd4590
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      AuthRefreshResponse:
 *        type: object
 *        required:
 *          - token
 *        properties:
 *          token:
 *            type: string
 *            description: token.
 *        example:
 *           token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZTdmZmFiOC0wM2RlLWNkZTEtNDVjMy03ZWE5YTJmNjFlNTYiLCJlbWFpbCI6ImpzZWlqYXNAZ21haWwuY29tIiwiaWF0IjoxNTgzMzQ5MDU0LCJleHAiOjE1ODMzNDkxMTR9.ftDxHN-EqBMIqxatjjyYwfD_l2wKBaiJO1lTE9DPTX8
 */

const router = express.Router();

/**
 * @swagger
 * path:
 *  /auth/local/login:
 *    post:
 *      summary: Create a token for the user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserLogin'
 *      responses:
 *        "200":
 *          description: A user token
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AuthToken'
 *        "404":
 *          description: Username or password not correct
 */
router.post('/auth/local/login', login);

/**
 * @swagger
 * path:
 *  /auth/local/refresh:
 *    post:
 *      summary: Refresh a token for the user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthRefresh'
 *      responses:
 *        "200":
 *          description: A user token
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AuthRefreshResponse'
 *        "401":
 *          description: Invalid refresh token
 */
router.post('/auth/local/refresh', refresh);


/**
 * @swagger
 * path:
 *  /auth/local/register:
 *    post:
 *      summary: Register a new user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: A new user is created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        "409":
 *          description: User already exists
 */
router.post('/auth/local/register', register);
router.get('/testprotected', ensureAuthenticated, (req, res) =>
  res.send(`Ok ${req.user.email}, access granted`)
);
router.get('/testunprotected', (req, res) => res.send(`Ok guest`));
module.exports = router;
