const express = require("express");
const app = express();
const Donation = require("../../models/Donation/donationCompany.js");
const Criteria = require("../../models/Donation/criteria.js");
const criteriaDTO = require("../../dto/criteria.js");
const Joi = require("joi");

const donationCriteriaController = {
  async addCriteria(req, res, next) {
    const donationCriteriaSchema = Joi.object({
      criteriaName: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required(),
    });

    const { error } = donationCriteriaSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const donationId = req.user._id;
    const { criteriaName, description, image } = req.body;

    let criteria;

    try {
      const criteriaToRegister = new Criteria({
        donationId,
        criteriaName,
        description,
        image,
      });

      criteria = await criteriaToRegister.save();
    } catch (error) {
      return next(error);
    }

    // 6. response send

    const criteriaDto = new criteriaDTO(criteria);

    return res.status(201).json({ criteria: criteriaDto, auth: true });
  },

  async editCriteria(req, res, next) {
    const donationCriteriaSchema = Joi.object({
      criteriaName: Joi.string(),
      description: Joi.string(),
      image: Joi.string(),
    });

    const { error } = donationCriteriaSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const { criteriaName, description, image } = req.body;

    const criteriaId = req.query.criteriaId;
    const existingCriteria = await Criteria.findById(criteriaId);

    if (!existingCriteria) {
      const error = new Error("Criteria not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (criteriaName) existingCriteria.criteriaName = criteriaName;
    if (description) existingCriteria.description = description;
    if (image) existingCriteria.image = image;

    // Save the updated test
    await existingCriteria.save();

    return res.status(200).json({
      message: "Criteria updated successfully",
      criteria: existingCriteria,
    });
  },

  async deleteCriteria(req, res, next) {
    const criteriaId = req.query.criteriaId;
    const existingCriteria = await Criteria.findById(criteriaId);

    if (!existingCriteria) {
      const error = new Error("Criteria not found!");
      error.status = 404;
      return next(error);
    }
    await Criteria.findByIdAndDelete({ _id: criteriaId });
    return res.status(200).json({ message: "Criteria deleted successfully" });
  },

  async getCriteria(req, res, next) {
    try {
      const criteriaId = req.query.criteriaId;
      const criteria = await Criteria.findById(criteriaId);

      if (!criteria) {
        const error = new Error("Criteria not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ criteria });
    } catch (error) {
      return next(error);
    }
  },

  async getAllCriterion(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const criterionPerPage = 10;
      const donationId = req.user._id;
      const totalCriterion = await Criteria.countDocuments({ donationId }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalCriterion / criterionPerPage); // Calculate the total number of pages

      const skip = (page - 1) * criterionPerPage; // Calculate the number of posts to skip based on the current page

      const criterion = await Criteria.find({ donationId })
        .skip(skip)
        .limit(criterionPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      // const medDto = new medDTO(criterion);
      return res.status(200).json({
        criterion: criterion,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = donationCriteriaController;
