const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");

const AppDataSource = require("../config/db");
const User = require("../models/user");

const userRepository = AppDataSource.getRepository(User);

// ====================== REGISTER ======================
const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    const existingUser = await userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Allow only customer or owner to register
    const allowedRoles = ["customer", "owner"];

    const user = userRepository.create({
      fullName,
      email,
      password: hashedPassword,
      role: allowedRoles.includes(role) ? role : "customer",
    });

    await userRepository.save(user);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ====================== LOGIN ======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Access Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Refresh Token
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ====================== REFRESH TOKEN ======================
const refreshToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token is required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Token refreshed successfully",
      token: newToken,
    });

  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// ====================== PROFILE ======================
const getProfile = async (req, res) => {
  try {
    const user = await userRepository.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ====================== CHANGE PASSWORD ======================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const user = await userRepository.findOne({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await userRepository.save(user);

    res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ====================== FORGOT PASSWORD ======================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    await userRepository.save(user);

    res.status(200).json({
      message: "Password reset token generated successfully",
      resetToken,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ====================== RESET PASSWORD ======================
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        message: "Reset token and new password are required",
      });
    }

    const user = await userRepository.findOne({
      where: {
        resetToken,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Invalid reset token",
      });
    }

    if (new Date() > new Date(user.resetTokenExpires)) {
      return res.status(400).json({
        message: "Reset token has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;

    await userRepository.save(user);

    res.status(200).json({
      message: "Password reset successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  getProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};