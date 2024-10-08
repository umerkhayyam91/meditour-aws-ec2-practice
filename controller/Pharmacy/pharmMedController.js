const Medicines = require("../../models/Pharmacy/medicine.js");
const Joi = require("joi");
const medDTO = require("../../dto/med.js");
const Medicine = require("../../models/Pharmacy/medicine.js");

const pharmMedController = {
  async addMed(req, res, next) {
    const pharmMedSchema = Joi.object({
      generic: Joi.string().required(),
      medicineName: Joi.string().required(),
      medicineBrand: Joi.string().required(),
      medicineType: Joi.string().required(),
      medicineImage: Joi.string().required(),
      strength: Joi.string().required(),
      packSize: Joi.string().required(),
      priceMeditour: Joi.number().required(),
      actualPrice: Joi.number().required(),
    });

    const { error } = pharmMedSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const pharmId = req.user._id;
    const {
      generic,
      medicineName,
      medicineBrand,
      medicineType,
      medicineImage,
      strength,
      packSize,
      priceMeditour,
      actualPrice,
    } = req.body;
    // try {
    //   const testInUse = await Tests.exists({ testName, pharmId });

    //   if (testInUse) {
    //     const error = new Error("Test already added, use another TestName!");
    //     error.status = 409;
    //     return next(error);
    //   }
    // } catch (error) {
    //   return next(error);
    // }
    let med;

    let medCode = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 99999999

    try {
      const medToRegister = new Medicine({
        pharmId,
        medCode,
        generic,
        medicineName,
        medicineBrand,
        medicineType,
        medicineImage,
        strength,
        packSize,
        priceMeditour,
        actualPrice,
      });

      med = await medToRegister.save();
    } catch (error) {
      return next(error);
    }

    // 6. response send

    const medDto = new medDTO(med);

    return res.status(201).json({ med: medDto, auth: true });
  },

  async editMed(req, res, next) {
    const pharmMedSchema = Joi.object({
      generic: Joi.string(),
      medicineName: Joi.string(),
      medicineBrand: Joi.string(),
      medicineType: Joi.string(),
      medicineImage: Joi.string(),
      strength: Joi.string(),
      packSize: Joi.string(),
      priceMeditour: Joi.number(),
      actualPrice: Joi.number(),
    });

    const { error } = pharmMedSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      generic,
      medicineName,
      medicineBrand,
      medicineType,
      medicineImage,
      strength,
      packSize,
      priceMeditour,
      actualPrice,
    } = req.body;
    const pharmId = req.user._id;
    console.log(pharmId);
    // try {
    //   const testInUse = await Tests.exists({ testName, pharmId });

    //   if (testInUse) {
    //     const error = new Error("Test already added, use another TestName!");
    //     error.status = 409;
    //     return next(error);
    //   }
    // } catch (error) {
    //   return next(error);
    // }

    const medId = req.query.medId;
    const existingMed = await Medicine.findById(medId);

    if (!existingMed) {
      const error = new Error("Medicine not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (generic) existingMed.generic = generic;
    if (medicineName) existingMed.medicineName = medicineName;
    if (medicineBrand) existingMed.medicineBrand = medicineBrand;
    if (medicineType) existingMed.medicineType = medicineType;
    if (medicineImage) existingMed.medicineImage = medicineImage;
    if (strength) existingMed.strength = strength;
    if (packSize) existingMed.packSize = packSize;
    if (priceMeditour) existingMed.priceMeditour = priceMeditour;
    if (actualPrice) existingMed.actualPrice = actualPrice;

    // Save the updated test
    await existingMed.save();

    return res
      .status(200)
      .json({ message: "Medicine updated successfully", medicine: existingMed });
  },

  async deleteMed(req, res, next) {
    const medId = req.query.medId;
    const existingMed = await Medicine.findById(medId);

    if (!existingMed) {
      const error = new Error("Medicine not found!");
      error.status = 404;
      return next(error);
    }
    await Medicine.findByIdAndDelete({ _id: medId });
    return res.status(200).json({ message: "Medicine deleted successfully" });
  },

  async getMed(req, res, next) {
    try {
      const medId = req.query.medId;
      const medicine = await Medicine.findById(medId);

      if (!medicine) {
        const error = new Error("Medicine not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ medicine });
    } catch (error) {
      return next(error);
    }
  },

  async getAllMeds(req, res, next) {
    try {
      console.log(req);

      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const medPerPage = 10;
      const pharmId = req.user._id;
      console.log("pharmId", pharmId);
      const totalMeds = await Medicine.countDocuments({ pharmId }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalMeds / medPerPage); // Calculate the total number of pages

      const skip = (page - 1) * medPerPage; // Calculate the number of posts to skip based on the current page

      const medicines = await Medicine.find({ pharmId })
        .skip(skip)
        .limit(medPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      // const medDto = new medDTO(medicines);
      return res.status(200).json({
        medicines: medicines,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },
};
module.exports = pharmMedController;
