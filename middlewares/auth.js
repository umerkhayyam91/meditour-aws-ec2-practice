const JWTService = require("../services/JWTService");
const User = require("../models/user");
const labDto = require("../dto/lab");
const Laboratory = require("../models/Laboratory/laboratory");

const auth = async (req, res, next) => {
  try {
    // 1. refresh, access token validation
    const { refreshToken, accessToken } = req.cookies;
    console.log(accessToken);
    if (!refreshToken || !accessToken) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    let _id;

    try {
      _id = JWTService.verifyAccessToken(accessToken)._id;
    } catch (error) {
      return next(error);
    }

    let user;
    if (req.originalUrl.includes("/lab")) {
      try {
        user = await Laboratory.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const LabDto = new labDto(user);

      req.user = LabDto;

      next();
      return;
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = auth;
