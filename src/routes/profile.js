const express = require("express");
const { authUser } = require("../middlewares/auth");
const isFieldsCanEdit = require("../utils/canEditUser");

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

profileRouter.patch("/profile/password", authUser, async (req, res) => {
    try {
        
    } catch(e) {
        res.status(400).send("Error: " + e.message);
    }
});

module.exports = profileRouter;