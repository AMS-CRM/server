const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const authorization = require("./authorization");

const User = require("../models/user.model.js");
const Group = require("../models/groups.model.js");
const Role = require("../models/roles.model.js");

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password")
     /*.populate({
        path: 'group',
        populate: {
            path: 'roles',
            populate: 'permissions.service'
        }
      })*/
      req.token = token;
      next() 
      //return authorization(req, res, next);

    } catch (error) {
      res.status(401)
      throw new Error(error)
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = { protect }