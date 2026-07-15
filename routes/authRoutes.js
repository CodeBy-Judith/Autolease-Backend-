const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refreshToken,
  getProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);
router.get("/profile", authMiddleware, getProfile);
router.put("/change-password", authMiddleware, changePassword);

router.get("/test", (req, res) => {
  res.json({
    message: "Auth route is working",
  });
});

module.exports = router;