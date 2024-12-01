const UserModel = require("../models/auth-model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { createError } = require("../utils");
const { config } = require("../config");

class AuthController {
  async register(req, res, next) {
    const { name, email, password } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      name === "" ||
      email === "" ||
      password === ""
    ) {
      return next(createError("All fields are required.", 404));
    }
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        return next(
          createError(`This ${user.email} has been already registered.`, 409)
        );
      }

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to register user",
        error: error.message,
      });
    }
  }
  async login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return next(createError("All fields are required.", 404));
    }
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return next(createError(`This ${user.email} is not registered`, 404));
      }
      if (!(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id }, config.get("jwtToken"), {
        expiresIn: "7d",
      });
      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: token,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to login user",
        error: error.message,
      });
    }
  }
  async forgotPassword(req, res, next) {
    const { email } = req.body;
    if (!email || email === "") {
      return next(createError("Email is required.", 404));
    }
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return next(createError(`The ${user.email} not found.`, 404));
      }
      const resetToken = jwt.sign({ id: user._id }, config.get("jwtToken"), {
        expiresIn: "15m",
      });
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 15 * 60 * 1000;
      await user.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.get("emailUser"),
          pass: config.get("emailPassword"),
        },
      });
      const mailOptions = {
        to: user.email,
        subject: "Password Reset",
        text: `You requested a password reset. Use the token below to reset your password:\n\n${resetToken}\n\nThis token is valid for 15 minutes.`,
      };
      await transporter.sendMail(mailOptions);
      res.status(200).json({
        success: true,
        message: "Password reset token sent to your email.",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: err.message,
      });
    }
  }
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      const decoded = jwt.verify(token, config.get("jwtToken"));
      const user = await UserModel.findOne({
        _id: decoded.id,
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });

      // Update password
      user.password = newPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password has been reset successfully.",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async logout(req, res) {
    res.status(200).json({ success: true, message: "Logged out successfully" });
  }
}

module.exports = new AuthController();
