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

module.exports = requestRouter;