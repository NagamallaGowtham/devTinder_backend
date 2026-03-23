const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { handleCheck } = require("../utils/handleChecks");


authRouter.post("/signup", async (req, res) => {
    try {
        // handle validation
        handleCheck(req);

        // password encryption
        const {firstName, lastName, emailId, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();
        res.send("Signed in successfully!");
    } catch(err) {
        res.status(400).send("Error: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            // create JWT 
            const token = await user.getJWT();

            // inject the token into the cookie
            res.cookie("token", token, {expires: new Date(Date.now() + 7 * 86400000)});

            res.send("User logged in successfully!");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch(err) {
        res.status(400).send("Error: " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {expires : new Date(Date.now())});
    res.send("logged out successfully");
});

module.exports = authRouter;