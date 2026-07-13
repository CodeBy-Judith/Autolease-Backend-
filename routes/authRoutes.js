const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refreshToken,
  getProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;