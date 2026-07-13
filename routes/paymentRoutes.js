const express = require("express");
const router = express.Router();

const {
  initializePayment,
  verifyPayment,
  getPaymentHistory,
} = require("../controllers/paymentController");

router.post("/initialize", initializePayment);
router.put("/verify/:reference", verifyPayment);
router.get("/", getPaymentHistory);

module.exports = router;