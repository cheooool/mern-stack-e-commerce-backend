const expressJwt = require('express-jwt');

function authJwt() {
  const secret = process.env.SECRET;
  const apiUrl = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      `${apiUrl}/users/login`,
      `${apiUrl}/users/register`,
    ],
  });
}

async function isRevoked(req, payload, done) {
  console.log(payload);
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}

module.exports = authJwt;
