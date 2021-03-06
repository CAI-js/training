const { uuid } = require('@nlpjs/basic');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {
  jwtExpiration,
  jwtSecret,
  jwtAlgorithm,
  jwtExpirationSeconds,
} = require('../core/auth/defaults');
const database = require('../core/database');
const { idField, Collections } = require('./constants');

const refreshTokens = {};

function login(req, res) {
  passport.authenticate('local', { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(404).send('username of password not correct');
    }
    const payload = {
      sub: user[idField],
      name: user.name,
      email: user.email,
    };
    const refreshToken = uuid();
    refreshTokens[refreshToken] = {
      email: payload.email,
      name: payload.name,
      sub: payload.sub,
    };
    const token = jwt.sign(payload, jwtSecret, {
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpiration,
    });
    return res.json({
      access_token: token,
      refresh_token: refreshToken,
      token_type: 'bearer',
      expires: jwtExpirationSeconds,
    });
  })(req, res);
}

function refresh(req, res) {
  const { email } = req.body;
  const { refreshToken } = req.body;
  const refreshData = refreshTokens[refreshToken];
  if (!refreshData || refreshData.email !== email) {
    return res.status(401).send('Invalid refresh token');
  }
  const newRefreshToken = uuid();
  delete refreshTokens[refreshTokens];
  refreshTokens[newRefreshToken] = refreshData;
  const payload = {
    sub: refreshData.sub,
    email: refreshData.email,
    name: refreshData.name,
  };
  const token = jwt.sign(payload, jwtSecret, {
    algorithm: jwtAlgorithm,
    expiresIn: jwtExpiration,
  });
  return res.json({
    access_token: token,
    refresh_token: newRefreshToken,
    token_type: 'bearer',
    expires: jwtExpirationSeconds,
  });
}

function register(req, res, next) {
  database
    .findOne(Collections.User, { mail: req.body.mail })
    .then(user => {
      if (user) {
        const error = new Error('user already exists');
        error.status = 409;
        throw error;
      }
      const hash = bcrypt.hashSync(req.body.password, 10);
      const document = {
        email: req.body.email,
        password: hash,
        name: req.body.name,
      };
      database
        .insertOne(Collections.User, document)
        .then(() => {
          res.status(200).send('User created');
        })
        .catch(errCreating => next(errCreating));
    })
    .catch(err => next(err));
}

module.exports = {
  login,
  register,
  refresh,
};
