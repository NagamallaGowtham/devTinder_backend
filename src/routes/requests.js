const express = require("express");
const { authUser } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendRequest", authUser, async (req, res) => {
    try {
        const user = req.user;

        res.send(user.firstName + " sent you connection request");
    } catch(e) {
        res.status(400).send("Error: " + e.message);
    }
});

module.exports = requestRouter;