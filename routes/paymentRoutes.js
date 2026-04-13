const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const paymentController = require("../CONTROLLERS/paymentController.js");

// Create Razorpay order
router.post("/create-order", wrapAsync(paymentController.createOrder));

// Verify payment
router.post("/verify", wrapAsync(paymentController.verifyPayment));

module.exports = router;