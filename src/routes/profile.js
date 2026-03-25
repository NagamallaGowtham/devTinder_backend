const express = require("express");
const bcrypt = require("bcrypt");
const { authUser } = require("../middlewares/auth");
const isFieldsCanEdit = require("../utils/canEditUser");
const User = require("../models/user");
const isPasswordStrong = require("../utils/strongPassword");

const profileRouter = express.Router();

profileRouter.post("/profile/view", authUser, async (req, res) => {
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
            res.send("Profile updated successfully");
        }
    } catch (e) {
        res.status(400).json({status: false, message: e.message, data: {}});
    }
});

// Change password
profileRouter.patch("/profile/password", authUser, async (req, res) => {
    try {
        const {oldPassword, newPassword, confirmNewPassword} = req.body;

        const user = req.user;

        const validateOldPassword = await user.validatePassword(oldPassword);

        if (!validateOldPassword) {
            throw new Error("Incorrect Password");
        }

        if (newPassword === confirmNewPassword) {
            if (!isPasswordStrong(newPassword)) {
                throw new Error("Password is not strong enough");
            }

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

module.exports = profileRouter;