const jwt = require('jsonwebtoken');

require('dotenv').config();

const { JWT_SECRET } = process.env;

exports.auth = async (req, res, next) => {
  try {
    const token = req.body.token || req.query.token || req.headers.token;

    if (!token) {
      return res.send({ status: 403, message: 'A token is required for authentication' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      return res.send({ status: 401, message: 'Invalid Token' });
    }
    return next();
  } catch (error) {
    res.send({
      status: 401,
      error,
      message: 'User session expired,Log in to continue',
    });
  }
};