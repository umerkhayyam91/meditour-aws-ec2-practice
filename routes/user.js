const express = require("express");
const userAuthController = require("../controller/User/userAuthController");
const VerificationController = require("../controller/verificationController");
const labTestController = require("../controller/Laboratory/labTestController");
const auth = require("../middlewares/auth");
const multer = require("multer");
const userLabController = require("../controller/User/labController");
const userPharmacyController = require("../controller/User/pharmacyController");
const userDoctorController = require("../controller/User/doctorController");
const psychologistController = require("../controller/User/psychologistController");
const router = express.Router();

//............auth...............
router.post("/user/register", userAuthController.register);
router.post("/user/login", userAuthController.login);
router.post("/user/logout", auth, userAuthController.logout);

//..............verification.........
router.post("/user/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/user/confirmEmail", VerificationController.confirmEmail);
router.post("/user/ResetLink", VerificationController.ResetLink);
router.post("/user/resetPassword", VerificationController.resetPassword);

//.............Laboratory...................//
router.get("/user/getNearbyLabs", userLabController.getNearbyLabs);
router.get("/user/getLab", userLabController.getLab);
router.get("/user/filterLabs", userLabController.filterLabs);
router.get("/user/getTest", labTestController.getTest);
router.get("/user/getAllTests", userLabController.getAllTests);
router.put("/user/addRemoveFav", auth, userLabController.addRemoveFav);
router.get("/user/getAllFav", auth, userLabController.getAllFav);
router.post("/user/addReview", auth, userLabController.addRatingReview);
router.get("/user/getAllRatingReviews", auth, userLabController.getAllRatingReviews);
router.post("/user/addLabOrder", auth, userLabController.addLabOrder);

//.............Pharmacy...................//
router.get("/user/getNearbyPharmacies", userPharmacyController.getNearbyPharmacies);
router.get("/user/getPharmacy", userPharmacyController.getPharmacy);
router.get("/user/filterPharmacies", userPharmacyController.filterPharmacies);
router.post("/user/addToCart", auth, userPharmacyController.addToCart);
router.get("/user/getCart", auth, userPharmacyController.getCart);
router.get("/user/getAllMeds", auth, userPharmacyController.getAllMeds);
router.post("/user/addPharmacyOrder", auth, userPharmacyController.addPharmacyOrder);
router.put("/user/addRemoveFavPharmacy", auth, userPharmacyController.addRemoveFavPharmacy);
router.get("/user/getAllFavPharmacies", auth, userPharmacyController.getAllFavPharmacies);

//..............Doctors...................//
router.get("/user/getNearbyDocs", userDoctorController.getNearbyDocs);
router.get("/user/filterDocs", userDoctorController.filterDocs);
router.get("/user/getDoc", userDoctorController.getDoc);
router.get("/user/getAvailability", userDoctorController.getAvailability);
router.get("/user/addAppointment", auth, userDoctorController.addAppointment);

//...........Psychologists.............//

router.get("/user/getNearbyPsychologists", psychologistController.getNearbyPsychologists);
router.get("/user/filterPsychologist", psychologistController.filterPsychologist);
router.get("/user/getPsychologist" , psychologistController.getPsychologist);
router.get("/user/getPsychoAvailability", psychologistController.getPsychoAvailability );
router.get("/user/addPsyAppointment",psychologistController.addPsyAppointment);
router.post("/user/addPsyRatingReview",psychologistController.addPsyRatingReview);
router.get("/user/getAllRatingReviews",psychologistController.getAllRatingReviews);
module.exports = router;
