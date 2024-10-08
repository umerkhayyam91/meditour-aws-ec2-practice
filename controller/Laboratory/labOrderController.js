const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Order = require("../../models/Laboratory/labOrder.js");
const orderDto = require("../../dto/labOrder.js");
const moment = require("moment");
const Tests = require("../../models/Laboratory/tests.js");

async function getOrderCountsForWeek(labId, startDate, endDate) {
  const days = [];
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    const nextDate = moment(currentDate).endOf("day");
    // Modify this query based on your actual data structure
    const ordersCount = await Order.find({
      createdAt: { $gte: currentDate, $lt: nextDate },
      labId: labId,
    }).countDocuments();

    days.push({
      date: currentDate.format("YYYY-MM-DD"),
      ordersCount,
    });

    currentDate.add(1, "days");
  }

  return days;
}

const labOrderController = {
  async getOrders(req, res) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const ordersPerPage = 5;
      const labId = req.user._id;
      const totalOrders = await Order.countDocuments({ labId }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalOrders / ordersPerPage); // Calculate the total number of pages

      const skip = (page - 1) * ordersPerPage; // Calculate the number of posts to skip based on the current page

      const allOrders = await Order.find({ labId })
        .skip(skip)
        .limit(ordersPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      // const OrderDto = new orderDto(allOrders);
      return res.status(200).json({
        orders: allOrders,
        auth: true,
        totalOrders,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failure",
        error: error.message,
      });
    }
  },

  async changeStatus(req, res, next) {
    try {
      const newStatus = req.body.status;
      if (!newStatus) {
        const error = {
          status: 401,
          message: "Status not found",
        };

        return next(error);
      }
      const id = req.query.id;
      const order = await Order.findById(id);
      if (newStatus == "completed" && order.results == "") {
        const error = {
          status: 404,
          message: "Plaese Upload Result First",
        };

        return next(error);
      }
      const result = await Order.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { status: newStatus } },
        { returnDocument: "after" } // Optional: Specify 'after' to return the updated document
      );
      console.log(result);
      if (!result) {
        const error = {
          status: 401,
          message: "Order not found",
        };

        return next(error);
      }
      res.status(200).json({
        auth: true,
        message: "status changed successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  async saveResult(req, res, next) {
    try {
      const resultUrl = req.body.resultUrl;
      const orderId = req.query.orderId;
      const order = await Order.findById(orderId);
      if (!order) {
        const error = {
          status: 404,
          message: "Order not found",
        };

        return next(error);
      }
      order.results = resultUrl;
      await order.save();

      res.json({ message: "Result uploaded successfully!", auth: true });
    } catch (error) {
      return next(error);
    }
  },

  async getCompletedOrders(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const ordersPerPage = 5;
      const labId = req.user._id;
      const totalOrders = await Order.countDocuments({ labId, status: "completed" }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalOrders / ordersPerPage); // Calculate the total number of pages

      const skip = (page - 1) * ordersPerPage; // Calculate the number of posts to skip based on the current page

      const allOrders = await Order.find({ labId, status: "completed" })
        .skip(skip)
        .limit(ordersPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      // const OrderDto = new orderDto(allOrders);
      return res.status(200).json({
        orders: allOrders,
        auth: true,
        totalOrders,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failure",
        error: error.message,
      });
    }
  },

};

module.exports = labOrderController;
