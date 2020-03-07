const passport = require('passport');

function ensureAuthenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (info) {
      return res.status(401).send(info.message);
    }
    if (err) {
      return next(err);
    }
    if (!user) {
      const error = new Error('You have no access');
      error.status = 401;
      return next(error);
    }
    req.user = user;
    return next();
  })(req, res, next);
}

module.exports = ensureAuthenticated;
