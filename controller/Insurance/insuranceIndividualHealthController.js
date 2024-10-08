const IndividualHealth = require("../../models/Insurance/individualHealthInsurance.js");
const Joi = require("joi");
const individualhealthDTO = require("../../dto/Insurance/individualHealth.js");

const insuranceHealthController = {
  async addIndividualHealth(req, res, next) {
    console.log("object");
    const insuranceRegisterSchema = Joi.object({
      ageCriteria: Joi.object(),
      hospitalizationLimit: Joi.object(),
      gender: Joi.string(),
      packageName: Joi.string(),
      packageLogo: Joi.string(),
      hospitalizationPerPerson: Joi.string(),
      dailyRoomAndBoardLimit: Joi.string(),
      claimPayoutRatio: Joi.string(),
      hospitals: Joi.array(),
      laboratories: Joi.array(),
      icuCcuLimits: Joi.string(),
      accidentalEmergencyLimits: Joi.string(),
      ambulanceCoverage: Joi.string(),
      specializedInvestigationCoverage: Joi.string(),
      waitingPeriod: Joi.string(),
      maternity: Joi.string(),
      policyDocument: Joi.string(),
      claimProcess: Joi.string(),
      heading: Joi.string(),
      description: Joi.string(),
      actualPrice: Joi.string(),
      meditourPrice: Joi.string(),
      perYear: Joi.string(),
    });

    const { error } = insuranceRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    console.log("objects");

    const {
      ageCriteria,
      hospitalizationLimit,
      gender,
      packageName,
      packageLogo,
      hospitalizationPerPerson,
      dailyRoomAndBoardLimit,
      claimPayoutRatio,
      hospitals,
      laboratories,
      icuCcuLimits,
      accidentalEmergencyLimits,
      ambulanceCoverage,
      specializedInvestigationCoverage,
      waitingPeriod,
      maternity,
      policyDocument,
      claimProcess,
      heading,
      description,
      actualPrice,
      meditourPrice,
      perYear,
    } = req.body;

    let insurance;
    const insuranceId = req.user._id;
    try {
      const insuranceToRegister = new IndividualHealth({
        insuranceId,
        ageCriteria,
        hospitalizationLimit,
        gender,
        packageName,
        packageLogo,
        hospitalizationPerPerson,
        dailyRoomAndBoardLimit,
        claimPayoutRatio,
        hospitals,
        laboratories,
        icuCcuLimits,
        accidentalEmergencyLimits,
        ambulanceCoverage,
        specializedInvestigationCoverage,
        waitingPeriod,
        maternity,
        policyDocument,
        claimProcess,
        heading,
        description,
        actualPrice,
        meditourPrice,
        perYear,
      });

      console.log("objectss");
      insurance = await insuranceToRegister.save();
      const individualhealthDto = new individualhealthDTO(insurance);

      return res
        .status(201)
        .json({ insurance: individualhealthDto, auth: true });
    } catch (error) {
      return next(error);
    }
  },

  async editIndividualHealth(req, res, next) {
    const insuranceHealthSchema = Joi.object({
      ageCriteria: Joi.object(),
      hospitalizationLimit: Joi.object(),
      gender: Joi.string(),
      packageName: Joi.string(),
      packageLogo: Joi.string(),
      hospitalizationPerPerson: Joi.string(),
      dailyRoomAndBoardLimit: Joi.string(),
      claimPayoutRatio: Joi.string(),
      hospitals: Joi.array(),
      laboratories: Joi.array(),
      icuCcuLimits: Joi.string(),
      accidentalEmergencyLimits: Joi.string(),
      ambulanceCoverage: Joi.string(),
      specializedInvestigationCoverage: Joi.string(),
      waitingPeriod: Joi.string(),
      maternity: Joi.string(),
      policyDocument: Joi.string(),
      claimProcess: Joi.string(),
      heading: Joi.string(),
      description: Joi.string(),
      actualPrice: Joi.string(),
      meditourPrice: Joi.string(),
      perYear: Joi.string(),
    });

    const { error } = insuranceHealthSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      ageCriteria,
      hospitalizationLimit,
      gender,
      packageName,
      packageLogo,
      hospitalizationPerPerson,
      dailyRoomAndBoardLimit,
      claimPayoutRatio,
      hospitals,
      laboratories,
      icuCcuLimits,
      accidentalEmergencyLimits,
      ambulanceCoverage,
      specializedInvestigationCoverage,
      waitingPeriod,
      maternity,
      policyDocument,
      claimProcess,
      heading,
      description,
      actualPrice,
      meditourPrice,
      perYear,
    } = req.body;

    const insuranceHealthId = req.query.insuranceHealthId;
    const existingInsurance = await IndividualHealth.findById(
      insuranceHealthId
    );

    if (!existingInsurance) {
      const error = new Error("Individual Health not found!");
      error.status = 404;
      return next(error);
    }
console.log(ageCriteria);
    // Update only the provided fields
    if (ageCriteria) existingInsurance.ageCriteria = ageCriteria;
    if (hospitalizationLimit)
      existingInsurance.hospitalizationLimit = hospitalizationLimit;
    if (gender)
      existingInsurance.gender = gender;
    if (packageName) existingInsurance.packageName = packageName;
    if (packageLogo) existingInsurance.packageLogo = packageLogo;
    if (hospitalizationPerPerson)
      existingInsurance.hospitalizationPerPerson = hospitalizationPerPerson;
    if (dailyRoomAndBoardLimit)
      existingInsurance.dailyRoomAndBoardLimit = dailyRoomAndBoardLimit;
    if (claimPayoutRatio) existingInsurance.claimPayoutRatio = claimPayoutRatio;
    if (hospitals) existingInsurance.hospitals = hospitals;
    if (laboratories) existingInsurance.laboratories = laboratories;
    if (icuCcuLimits) existingInsurance.icuCcuLimits = icuCcuLimits;
    if (accidentalEmergencyLimits)
      existingInsurance.accidentalEmergencyLimits = accidentalEmergencyLimits;
    if (ambulanceCoverage)
      existingInsurance.ambulanceCoverage = ambulanceCoverage;
    if (specializedInvestigationCoverage)
      existingInsurance.specializedInvestigationCoverage =
        specializedInvestigationCoverage;
    if (waitingPeriod) existingInsurance.waitingPeriod = waitingPeriod;
    if (maternity) existingInsurance.maternity = maternity;
    if (policyDocument) existingInsurance.policyDocument = policyDocument;
    if (claimProcess) existingInsurance.claimProcess = claimProcess;
    if (heading) existingInsurance.heading = heading;
    if (description) existingInsurance.description = description;
    if (actualPrice) existingInsurance.actualPrice = actualPrice;
    if (meditourPrice) existingInsurance.meditourPrice = meditourPrice;
    if (perYear) existingInsurance.perYear = perYear;

    // Save the updated test
    await existingInsurance.save();

    return res.status(200).json({
      message: "Individual Health updated successfully",
      insurance: existingInsurance,
    });
  },

  async deleteIndividualHealth(req, res, next) {
    const insuranceHealthId = req.query.insuranceHealthId;
    const existingInsurance = await IndividualHealth.findById(
      insuranceHealthId
    );

    if (!existingInsurance) {
      const error = new Error("Individual Health not found!");
      error.status = 404;
      return next(error);
    }
    await IndividualHealth.findByIdAndDelete({ _id: insuranceHealthId });
    return res
      .status(200)
      .json({ message: "Individual Health deleted successfully" });
  },

  async getIndividualHealth(req, res, next) {
    try {
      const insuranceHealthId = req.query.insuranceHealthId;
      const existingInsurance = await IndividualHealth.findById(
        insuranceHealthId
      );

      if (!existingInsurance) {
        const error = new Error("Individual Health not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ existingInsurance });
    } catch (error) {
      return next(error);
    }
  },

  async getAllIndividualHealth(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const insurancePerPage = 10;
      const insuranceId = req.user._id;
      const totalinsurance = await IndividualHealth.countDocuments({
        insuranceId,
      }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalinsurance / insurancePerPage); // Calculate the total number of pages

      const skip = (page - 1) * insurancePerPage; // Calculate the number of posts to skip based on the current page

      const insurances = await IndividualHealth.find({ insuranceId })
        .skip(skip)
        .limit(insurancePerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      return res.status(200).json({
        insurances: insurances,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = insuranceHealthController;
