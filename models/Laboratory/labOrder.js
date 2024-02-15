const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laboratory",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    testIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    orderId: {
      type: String,
      required: true,
    },
    preference: {
      type: String,
      enum: ["labVisit", "homeSample"],
    },
    currentLocation: {
      type: String,
    },
    prescription: {
      type: String,
    },
    patientName: {
      type: String,
      required: true,
    },
    MR_NO: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "inProcess", "completed"],
      default: "pending",
    },
    results: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LabOrder", orderSchema, "lab orders");
