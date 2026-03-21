const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authUser = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if (!token) {
            throw new Error("Invalid token!!!");
        }

        const decoded = await jwt.verify(token, "DevTinder@2026");

        const {_id} = decoded;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();
    } catch(e) {
        res.status(400).send("Error: " + e.message);
    }
};

module.exports = {authUser}