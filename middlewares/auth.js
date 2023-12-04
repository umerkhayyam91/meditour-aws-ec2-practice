const JWTService = require("../services/JWTService");
const User = require("../models/user");
const labDto = require("../dto/lab");
const pharmDto = require("../dto/pharm");
const docDto = require("../dto/doctor");
const Laboratory = require("../models/Laboratory/laboratory");
const Pharmacy = require("../models/Pharmacy/pharmacy");
const Doctor = require("../models/Doctor/doctors");
const AccessToken = require("../models/accessToken");

const auth = async (req, res, next) => {
  try {
    // 1. refresh, access token validation
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    const ifTokenExists = await AccessToken.find({ token: accessToken });
    if (ifTokenExists == "") {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }
    
    if (!accessToken) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      
      return next(error);
    }
    // console.log(accessToken)

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
    } else if (req.originalUrl.includes("/pharm")) {
      try {
        user = await Pharmacy.findOne({ _id: _id });
        console.log(user)
      } catch (error) {
        return next(error);
      }
      const PharmDto = new pharmDto(user);

      req.user = PharmDto;
      next();
      return
    } else if (req.originalUrl.includes("/doc")) {
      try {
        user = await Doctor.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const docDTO = new docDto(user);

      req.user = docDTO;

      next();
      return;
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = auth;
