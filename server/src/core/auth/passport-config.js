const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcryptjs');
const { jwtSecret, jwtAlgorithm } = require('./defaults');

function getLocalStrategy(db) {
  const localOptions = {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  };
  const localStrategy = new LocalStrategy(
    localOptions,
    (email, password, done) => {
      db.findOne('users', { email })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: 'This email is not registered',
            });
          }
          return bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              return done(null, false, { message: 'Error matching user' });
            }
            if (isMatch) {
              return done(null, user);
            }
            return done(null, false, { message: 'Incorrect password' });
          });
        })
        .catch(err =>
          done(err, null, { message: 'Error connecting to database' })
        );
    }
  );
  return localStrategy;
}

function getJwtStrategy(db) {
  const opts = {};
  opts.secretOrKey = jwtSecret;
  opts.algorithms = [jwtAlgorithm];
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  const jwtStrategy = new JwtStrategy(opts, (payload, done) => {
    db.findById('users', payload.sub)
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'This user is not registered' });
        }
        return done(null, user);
      })
      .catch(err =>
        done(err, null, { message: 'Error connecting to database' })
      );
  });
  return jwtStrategy;
}

function configurePassport(db, passport) {
  const localStrategy = getLocalStrategy(db);
  passport.use(localStrategy);
  const jwtStrategy = getJwtStrategy(db);
  passport.use(jwtStrategy);
}

module.exports = configurePassport;
