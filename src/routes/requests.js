const express = require("express");
const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", authUser, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];
        const isStatusAllowed = allowedStatus.includes(status);
        if (!isStatusAllowed) {
            throw new Error("Status type is not valid!");
        }

        const user = await User.findById(toUserId);
        if (!user) {
            throw new Error("User doesn't exist");
        }

        const shouldRequestBeSent = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });
        if (shouldRequestBeSent) {
            throw new Error("Request can't be sent");
        }

        const request = await ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        await request.save();
        res.json({status: true, data: request});
    } catch (err) {
        res.status(400).json({status: false, message: err.message});
    }
});

requestRouter.post("/request/review/:status/:requestId", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Status type is not valid!");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
        if (!connectionRequest) {
            throw new Error("Connection is not valid");
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({status: true, data});
    } catch (err) {
        res.status(400).json({status: false, message: err.message});
    }
});

module.exports = requestRouter;