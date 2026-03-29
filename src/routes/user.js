const express = require("express");
const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received", authUser, async (req, res) => {
    try {
        const loggedIdUser = req.user;

        const requestsReceived = await ConnectionRequest.find({
            toUserId: loggedIdUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"]);
        if (!requestsReceived) {
            throw new Error("No requests received");
        }

        res.json({status: true, data: requestsReceived});
    } catch (err) {
        res.status(400).json({status: false, message: err.message});
    }
});

userRouter.get("/user/connections", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"]);

        const data = connections.map(row => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        });
        res.json({status: true, data});
    } catch (err) {
        res.status(400).json({status: false, message: err.message});
    }
});

module.exports = userRouter;