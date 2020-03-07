const jwtSecret = process.env.JWT_SECRET || 'algsowt979agsg9';
const jwtExpiration = process.env.JWT_LIFETIME || '15m';

module.exports = {
  jwtSecret,
  jwtAlgorithm: 'HS256',
  jwtExpiration,
};
