const express = require("express");
const bcrypt = require("bcrypt");
const { authUser } = require("../middlewares/auth");
const isFieldsCanEdit = require("../utils/canEditUser");
const User = require("../models/user");
const isPasswordStrong = require("../utils/strongPassword");

const profileRouter = express.Router();

profileRouter.get("/profile/view", authUser, async (req, res) => {
    try {
        const user = req.user;
        
        res.json({status: true, message: `This is the info about ${user.firstName}`, data: user});
    } catch (e) {
        res.status(400).json({status: false, message: e.message, data: {}});
    }
});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
    try {
        if (!isFieldsCanEdit(req)) {
            throw new Error("Fields are Invalid to edit");
        } else {
            const fieldsToUpdate = req.body;
            const user = req.user;

            Object.keys(fieldsToUpdate).forEach(field => (user[field] = fieldsToUpdate[field]))

            await user.save();
            res.status(200).json({status: true, message: "Profile updated successfully", data: user});
        }
    } catch (e) {
        res.status(400).json({status: false, message: e.message, data: {}});
    }
});

// Change password
profileRouter.patch("/profile/password/change", authUser, async (req, res) => {
    try {
        const {oldPassword, newPassword, confirmNewPassword} = req.body;

        const user = req.user;

        const validateOldPassword = await user.validatePassword(oldPassword);

        if (!validateOldPassword) {
            throw new Error("Incorrect Password");
        }

        if (!isPasswordStrong(newPassword)) {
            throw new Error("Password is not strong enough");
        }
        if (newPassword === confirmNewPassword) {

            const newUpdatedPassword = await bcrypt.hash(newPassword, 10);

            user.password = newUpdatedPassword;
            user.save();
            res.send("Your new Password is updated successfully!");
        } else {
            throw new Error("Confirmed password is not matching with new password");
        }
    } catch(e) {
        res.status(400).send("Error: " + e.message);
    }
});

// forgot password
profileRouter.post("/profile/password/forgot", async (req, res) => {
    try {
        const {emailId} = req.body;

        const user = await User.findOne({emailId: emailId});
        if (!user) {
            throw new Error("Entered email id is not registered");
        }

        // Generate 6 digit OTP 
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.resetOtp = otp;
        user.resetOtpExpiry = otpExpiry;

        console.log(otp);

        await user.save();
        res.send("Otp sent to your emailId");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

// verify otp
profileRouter.post("/profile/password/verifyOtp", async (req, res) => {
    try {
        const {emailId, otp} = req.body;

        const user = await User.findOne({emailId: emailId});
        if (!user) {
            throw new Error("User not found");
        }

        if (user.resetOtp !== otp) throw new Error("Incorrect Otp");
        if (user.resetOtpExpiry < new Date()) throw new Error("Otp is expired");

        user.isOtpVerified = true;
        await user.save();
        res.send("Otp is verified");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

// reset password 
profileRouter.post("/profile/password/reset", async (req, res) => {
    try {
        const {emailId, newPassword} = req.body;

        const user = await User.findOne({emailId: emailId});
        if (!user) {
            throw new Error("User not found");
        }

        if (!user.isOtpVerified) throw new Error("OTP is not verified");
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        user.isOtpVerified = false;

        await user.save();
        res.send("Password reset successful!!");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = profileRouter;