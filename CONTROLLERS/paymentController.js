const Razorpay = require("razorpay");
const crypto = require("crypto");
const Listing = require("../models/listing.js");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
module.exports.createOrder = async (req, res) => {
    try {
        const { listingId, nights = 1 } = req.body;
        const listing = await Listing.findById(listingId);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        const amount = listing.price * nights * 100; // Amount in paisa
        const options = {
            amount,
            currency: "INR",
            receipt: `receipt_${listingId}_${Date.now()}`,
            payment_capture: 1, // Auto capture
        };

        const order = await razorpay.orders.create(options);
        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
            listing: {
                id: listing._id,
                title: listing.title,
                price: listing.price,
                nights,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to create order" });
    }
};

// Verify payment
module.exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, listingId, nights } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment verified
            req.flash("success", "Payment successful! Booking confirmed.");
            res.json({ success: true, message: "Payment verified" });
        } else {
            req.flash("error", "Payment verification failed!");
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Verification failed" });
    }
};