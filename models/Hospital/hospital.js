const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    hospitalRegNo: {
      type: String,
      required: true,
    },
    emergencyNo: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    cnicOrPassportNo: {
      type: String,
      required: true,
    },
    hospitalAddress: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    incomeTaxNo: {
      type: String,
      required: true,
    },
    salesTaxNo: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    hospitalLogo: {
      type: String,
      required: true,
    },
    registrationImage: {
      type: String,
      required: true,
    },
    cnicImage: {
      type: String,
      required: true,
    },
    taxFileImage: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hospital", hospitalSchema, "hospitals");
