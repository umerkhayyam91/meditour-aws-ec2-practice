const express = require("express");
const nutritionistAuthController = require("../controller/Nutritionist/nutritionAuthController");
const VerificationController = require("../controller/verificationController");
const nutritionistAvailabilityController = require("../controller/Nutritionist/nutritionAvailabilityController")
const nutritionistAppointController = require("../controller/Nutritionist/nutritionAppointController")
const nutritionistDashController = require("../controller/Nutritionist/nutritionDashController")
const generalRequestController = require("../controller/All Doctors Controllers/generalRequestController")
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/nutritionist/register", nutritionistAuthController.register);
router.post("/nutritionist/login", nutritionistAuthController.login);
router.post("/nutritionist/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/nutritionist/completeSignup", nutritionistAuthController.completeSignup);
router.put("/nutritionist/updateProfile", auth, nutritionistAuthController.updateProfile);
router.post("/nutritionist/logout", auth, nutritionistAuthController.logout);
router.post("/nutritionist/refresh", auth, nutritionistAuthController.refresh);


//............availability............
router.post("/nutritionist/addAvailability", auth, nutritionistAvailabilityController.addAvailability);
router.get("/nutritionist/getAvailability", auth, nutritionistAvailabilityController.getAvailability);

//............Dashboard.................
router.get("/nutritionist/dashDetails", auth, nutritionistDashController.dashDetails);
router.get("/nutritionist/graph", auth, nutritionistDashController.graph);

//............appointments..............
router.get("/nutritionist/getAllAppointments", auth, nutritionistAppointController.getAllAppointments);
router.get("/nutritionist/getAllPatients", auth, nutritionistAppointController.getAllPatients);
router.get("/nutritionist/patientHistory", auth, nutritionistAppointController.patientHistory);
router.get("/nutritionist/getRequests", auth, nutritionistAppointController.getRequests);


//.............Appointment Requests........................
router.get("/nutritionist/getRequests", auth, generalRequestController.getRequests);
router.post("/nutritionist/acceptRequest", auth, generalRequestController.acceptRequest);
router.delete("/nutritionist/rejectRequest", auth, generalRequestController.rejectRequest);


//..............verification.........
router.post("/nutritionist/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/nutritionist/confirmEmail", VerificationController.confirmEmail);
router.post("/nutritionist/ResetLink", VerificationController.ResetLink);
router.post("/nutritionist/resetPassword", VerificationController.resetPassword);

module.exports = router;
