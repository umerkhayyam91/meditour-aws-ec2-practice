const express = require("express");
const app = express();
const Donation = require("../../models/Donation/donationCompany.js");
const Package = require("../../models/Donation/package.js");
const DonorList = require("../../models/Donation/donations.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const donationDTO = require("../../dto/donation.js");
const packageDTO = require("../../dto/package.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const donationPackageController = {
  async addPackage(req, res, next) {
    const donationPackageSchema = Joi.object({
      criteriaId: Joi.string().required(),
      donationTitle: Joi.string().required(),
      targetAudience: Joi.string().required(),
      requiredAmount: Joi.number().required(),
      totalDays: Joi.string().required(),
      description: Joi.string().required(),
      images: Joi.array().required(),
    });

    const { error } = donationPackageSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const donationId = req.user._id;
    const {
      criteriaId,
      donationTitle,
      targetAudience,
      requiredAmount,
      totalDays,
      description,
      images,
    } = req.body;

    let package;

    try {
      const packageToRegister = new Package({
        criteriaId,
        donationId,
        donationTitle,
        targetAudience,
        requiredAmount,
        totalDays,
        description,
        images,
      });

      package = await packageToRegister.save();
    } catch (error) {
      return next(error);
    }

    // 6. response send

    const packageDto = new packageDTO(package);

    return res.status(201).json({ package: packageDto, auth: true });
  },

  async editPackage(req, res, next) {
    const donationPackageSchema = Joi.object({
      criteriaId: Joi.string(),
      donationTitle: Joi.string(),
      targetAudience: Joi.string(),
      requiredAmount: Joi.number(),
      totalDays: Joi.string(),
      description: Joi.string(),
      images: Joi.array(),
    });

    const { error } = donationPackageSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      criteriaId,
      donationTitle,
      targetAudience,
      requiredAmount,
      totalDays,
      description,
      images,
    } = req.body;

    const packageId = req.query.packageId;
    const existingPackage = await Package.findById(packageId);

    if (!existingPackage) {
      const error = new Error("Package not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (criteriaId) existingPackage.criteriaId = criteriaId;
    if (donationTitle) existingPackage.donationTitle = donationTitle;
    if (targetAudience) existingPackage.targetAudience = targetAudience;
    if (requiredAmount) existingPackage.requiredAmount = requiredAmount;
    if (totalDays) existingPackage.totalDays = totalDays;
    if (description) existingPackage.description = description;
    if (images) existingPackage.images = images;

    // Save the updated test
    await existingPackage.save();

    return res.status(200).json({
      message: "Package updated successfully",
      package: existingPackage,
    });
  },

  async deletePackage(req, res, next) {
    const packageId = req.query.packageId;
    const existingPackage = await Package.findById(packageId);

    if (!existingPackage) {
      const error = new Error("Package not found!");
      error.status = 404;
      return next(error);
    }
    await Package.findByIdAndDelete({ _id: packageId });
    return res.status(200).json({ message: "Package deleted successfully" });
  },

  async getPackage(req, res, next) {
    try {
      const packageId = req.query.packageId;
      const package = await Package.findById(packageId);

      if (!package) {
        const error = new Error("Package not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ package });
    } catch (error) {
      return next(error);
    }
  },

  async getAllPackages(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const packagePerPage = 10;
      const donationId = req.user._id;
      const criteriaType = req.query.criteriaType;
      const totalPackages = await Package.countDocuments({ donationId }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalPackages / packagePerPage); // Calculate the total number of pages
      let packages;
      const skip = (page - 1) * packagePerPage; // Calculate the number of posts to skip based on the current page
      if (criteriaType) {
        packages = await Package.find({ donationId })
          .populate({
            path: "criteriaId",
            match: { criteriaName: criteriaType }, // Include the match condition
          })
          .exec();

        // Filter out the packages where criteriaId is null (no matching criteriaName)
        packages = packages.filter((pkg) => pkg.criteriaId !== null);
      } else {
         packages = await Package.find({ donationId })
          .skip(skip)
          .limit(packagePerPage);
      }
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      return res.status(200).json({
        packages: packages,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },

  
  //..........dummyApi............//
  async getCategoryPackages(req, res, next) {
    try {
      const donationId = req.user._id;
      const criteriaType = req.query.criteriaType;
      // if (!criteriaType) {
      //   const error = new Error("Criteria Type not found!");
      //   error.status = 404;
      //   return next(error);
      // }

      const packages = await Package.find({ donationId })
        .populate({
          path: "criteriaId",
          match: { criteriaName: criteriaType }, // Include the match condition
        })
        .exec();

      // Filter out the packages where criteriaId is null (no matching criteriaName)
      const filteredPackages = packages.filter(
        (pkg) => pkg.criteriaId !== null
      );

      return res.status(200).json({
        packages: filteredPackages,
        auth: true,
      });
    } catch (error) {
      return next(error);
    }
  },

  async addDonation(req, res, next) {
    try {
      const { packageId, mrNo, donorName, donationPurpose, donationAmount } =
        req.body;
      const donationId = req.user._id;

      // Create a new donation
      const newDonorList = new DonorList({
        donationId,
        packageId,
        userId: "656867ce85953ba14f2c9ff8",
        mrNo,
        donorName,
        donationPurpose,
        donationAmount,
      });

      // Save the new appointment to the database
      const savedDonorList = await newDonorList.save();

      res.status(201).json({
        donorList: savedDonorList,
        message: "DonorList added successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = donationPackageController;
