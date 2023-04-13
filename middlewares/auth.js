const jwt = require('jsonwebtoken')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decotedToken = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decotedToken.userId
    req.auth = { userId }
    next()
  } catch (error) {
    res.status(401).json({error});
  }

}
