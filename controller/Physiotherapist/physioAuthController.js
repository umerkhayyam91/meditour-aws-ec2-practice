const Joi = require("joi");
const bcrypt = require("bcryptjs");
const physioDTO = require("../../dto/physio.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");
const Physiotherapist = require("../../models/Physiotherapist/physiotherapist.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const physioAuthController = {
  async register(req, res, next) {
    const physioRegisterSchema = Joi.object({
      name: Joi.string().required(),
      cnicOrPassNo: Joi.string().required(),
      qualification: Joi.string().required(),
      speciality: Joi.string().required(),
      services: Joi.string().required(),
      loc: Joi.array().required(),
      clinicExperiences: Joi.string().required(),
      clinicName: Joi.string().required(),
      pmdcNumber: Joi.string().required(),
      emergencyNo: Joi.string().required(),
      clinicAddress: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string(),
      website: Joi.string(),
      twitter: Joi.string(),
      youtube: Joi.string(),
      instagram: Joi.string(),
      incomeTaxNo: Joi.string().required(),
      salesTaxNo: Joi.string().required(),
      bankName: Joi.string().required(),
      accountHolderName: Joi.string().required(),
      accountNumber: Joi.string().required(),
      physioImage: Joi.string(),
      cnicImage: Joi.string(),
      clinicLogo: Joi.string(),
      pmdcImage: Joi.string(),
      taxFileImage: Joi.string(),
      fcmToken: Joi.string(),
    });

    const { error } = physioRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      name,
      loc,
      cnicOrPassNo,
      qualification,
      speciality,
      services,
      clinicExperiences,
      clinicName,
      pmdcNumber,
      emergencyNo,
      clinicAddress,
      state,
      country,
      website,
      twitter,
      youtube,
      instagram,
      incomeTaxNo,
      salesTaxNo,
      bankName,
      accountHolderName,
      accountNumber,
      physioImage,
      cnicImage,
      clinicLogo,
      pmdcImage,
      taxFileImage,
      fcmToken
    } = req.body;

    let accessToken;
    let refreshToken;

    let physio;
    try {
      const physioToRegister = new Physiotherapist({
        name,
        loc,
        cnicOrPassNo,
        qualification,
        speciality,
        services,
        clinicExperiences,
        clinicName,
        pmdcNumber,
        emergencyNo,
        clinicAddress,
        state,
        country,
        website,
        twitter,
        youtube,
        instagram,
        incomeTaxNo,
        salesTaxNo,
        bankName,
        accountHolderName,
        accountNumber,
        physioImage,
        cnicImage,
        clinicLogo,
        pmdcImage,
        taxFileImage,
        fcmToken
      });

      physio = await physioToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: physio._id }, "365d");

      refreshToken = JWTService.signRefreshToken({ _id: physio._id }, "365d");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, physio._id);
    await JWTService.storeAccessToken(accessToken, physio._id);

    // 6. response send

    // const docDto = new doctorDto(doc);

    return res
      .status(201)
      .json({ physiotherapist: physio, auth: true, token: accessToken });
  },

  async login(req, res, next) {
    const physioLoginSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
      fcmToken: Joi.string(),
    });

    const { error } = physioLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password, fcmToken } = req.body;

    let physio;

    try {
      // match username
      const emailRegex = new RegExp(email, "i");
      physio = await Physiotherapist.findOne({ email: { $regex: emailRegex } });
      if (!physio) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }else {
        //update fcmToken
        if (fcmToken && physio?.fcmToken !== fcmToken) {
          Object.keys(physio).map((key) => (physio["fcmToken"] = fcmToken));

          let update = await physio.save();
        } else {
          console.log("same Token");
        }
      }
      if (physio.isVerified == false) {
        const error = {
          status: 401,
          message: "User not verified",
        };

        return next(error);
      }

      // match password

      const match = await bcrypt.compare(password, physio.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: physio._id }, "365d");
    const refreshToken = JWTService.signRefreshToken(
      { _id: physio._id },
      "365d"
    );
    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          userId: physio._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    try {
      await AccessToken.updateOne(
        {
          userId: physio._id,
        },
        { token: accessToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    const physioDto = new physioDTO(physio);

    return res
      .status(200)
      .json({ physiotherapist: physioDto, auth: true, token: accessToken });
  },

  async completeSignup(req, res, next) {
    const physioRegisterSchema = Joi.object({
      phoneNumber: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = physioRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    const { password, email, phoneNumber } = req.body;

    const userId = req.query.id;
    const existingUser = await Physiotherapist.findById(userId);

    if (!existingUser) {
      const error = new Error("User not found!");
      error.status = 404;
      return next(error);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update only the provided fields
    existingUser.email = email;
    existingUser.password = hashedPassword;
    existingUser.phoneNumber = phoneNumber;
    existingUser.isVerified = true;

    // Save the updated test
    await existingUser.save();

    return res
      .status(200)
      .json({
        message: "User updated successfully",
        Physiotherapist: existingUser,
      });
  },

  async updateProfile(req, res, next) {
    const physioSchema = Joi.object({
      name: Joi.string(),
      cnicOrPassNo: Joi.string(),
      qualification: Joi.string(),
      speciality: Joi.string(),
      services : Joi.string(),
      clinicName : Joi.string(),
      clinicAddress : Joi.string(),
      clinicExperiences : Joi.string(),
      loc: Joi.array().required(),
      pmdcNumber : Joi.string(),
      emergencyNo: Joi.string(),
      state: Joi.string(),
      phoneNumber: Joi.string(),
      currentPassword: Joi.string(),
      password: Joi.string().pattern(passwordPattern),
      confirmPassword: Joi.ref("password"),
      website: Joi.string(),
      twitter: Joi.string(),
      facebook: Joi.string(),
      instagram: Joi.string(),
      incomeTaxNo: Joi.string(),
      salesTaxNo: Joi.string(),
      bankName: Joi.string(),
      accountHolderName: Joi.string(),
      accountNumber: Joi.string(),
      doctorImage: Joi.string(),
      cnicImage: Joi.string(),
      pmdcImage: Joi.string(),
      taxFileImage: Joi.string(),
    });

    const { error } = physioSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      name,
      loc,
      cnicOrPassNo,
      qualification,
      speciality,
      services ,
      clinicName ,
      clinicAddress ,
      clinicExperiences ,
      pmdcNumber ,
      emergencyNo,
      state,
      phoneNumber,
      currentPassword,
      password,
      website,
      twitter,
      facebook,
      instagram,
      incomeTaxNo,
      salesTaxNo,
      bankName,
      accountHolderName,
      accountNumber,
      doctorImage,
      cnicImage,
      pmdcImage,
      taxFileImage,
    } = req.body;
    const physioId = req.user._id;

    const physio = await Physiotherapist.findById(physioId);

    if (!physio) {
      const error = new Error("Physiotherapist not found!");
      error.status = 404;
      return next(error);
    }

    if (currentPassword && password) {
      const match = await bcrypt.compare(currentPassword, physio.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };

        return next(error);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      physio.password = hashedPassword;
    }

    // Update only the provided fields
    if (name) physio.name = name;
    if(loc) physio.loc = loc;
    if (cnicOrPassNo) physio.cnicOrPassNo = cnicOrPassNo;
    if (qualification) physio.qualification = qualification;
    if (speciality) physio.speciality = speciality;
    if (services) physio.services = services;
    if (clinicName) physio.clinicName = clinicName;
    if (clinicAddress) physio.clinicAddress = clinicAddress;
    if (clinicExperiences) physio.clinicExperiences = clinicExperiences;
    if (pmdcNumber) physio.pmdcNumber = pmdcNumber;
    if (emergencyNo) physio.emergencyNo = emergencyNo; 
    if (state) physio.state = state;
    if (phoneNumber) physio.phoneNumber = phoneNumber;
    if (website) physio.website = website;
    if (facebook) physio.facebook = facebook;
    if (twitter) physio.twitter = twitter;
    if (instagram) physio.instagram = instagram;
    if (incomeTaxNo) physio.incomeTaxNo = incomeTaxNo;
    if (salesTaxNo) physio.salesTaxNo = salesTaxNo;
    if (bankName) physio.bankName = bankName;
    if (accountHolderName) physio.accountHolderName = accountHolderName;
    if (accountNumber) physio.accountNumber = accountNumber;
    if (doctorImage) physio.doctorImage = doctorImage;
    if (cnicImage) physio.cnicImage = cnicImage;
    if (pmdcImage) physio.pmdcImage = pmdcImage;
    if (taxFileImage) physio.taxFileImage = taxFileImage;

    // Save the updated test
    await physio.save();

    return res
      .status(200)
      .json({
        message: "Physiotherapist updated successfully",
        Physiotherapist: physio,
      });
  },

  async logout(req, res, next) {
    const userId = req.user._id;
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    try {
      await RefreshToken.deleteOne({ userId });
    } catch (error) {
      return next(error);
    }
    try {
      await AccessToken.deleteOne({ token: accessToken });
    } catch (error) {
      return next(error);
    }

    // 2. response
    res.status(200).json({ user: null, auth: false });
  },

  async refresh(req, res, next) {
    // 1. get refreshToken from cookies
    // 2. verify refreshToken
    // 3. generate new tokens
    // 4. update db, return response

    const authHeader = req.headers["authorization"];
    const originalRefreshToken = authHeader && authHeader.split(" ")[2];
    const accessToken = authHeader && authHeader.split(" ")[1];

    let id;

    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    try {
      const match = RefreshToken.findOne({
        userId: id,
        token: originalRefreshToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };

        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    let accessId;
    try {
      accessId = JWTService.verifyAccessToken(accessToken)._id;
      console.log(accessId);
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    try {
      const match = AccessToken.findOne({
        userId: accessId,
        token: accessToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };

        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    try {
      let accessToken = JWTService.signAccessToken({ _id: id }, "365d");

      let refreshToken = JWTService.signRefreshToken({ _id: id }, "365d");
      await RefreshToken.updateOne({ userId: id }, { token: refreshToken });
      await AccessToken.updateOne({ userId: accessId }, { token: accessToken });

      const physio = await Physiotherapist.findOne({ _id: id });

      const physioDto = new physioDTO(physio);

      return res
        .status(200)
        .json({
          Physiotherapist: physioDto,
          auth: true,
          accessToken: accessToken,
        });
    } catch (e) {
      return next(e);
    }
  },
};

module.exports = physioAuthController;
