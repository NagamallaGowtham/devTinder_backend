const express = require("express");
const { authUser } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.post("/profile", authUser, async (req, res) => {
    try {
        const user = req.user;
        
        res.send(user);
    } catch (e) {
        res.status(400).send("Error: " + e.message);
    }
});

module.exports = profileRouter;