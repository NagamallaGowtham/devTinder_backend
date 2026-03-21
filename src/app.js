const express = require("express");
const {connectDB} = require("./config/database");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const {handleCheck} = require("./utils/handleChecks");
const { authUser } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        // handle validations
        handleCheck(req);
    
        // password encryptions
        const {firstName, lastName, emailId, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
    
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();
        res.send("user saved successfully");
    } catch(e) {
        res.status(400).send("Something went wrong" + e.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            throw new Error("Invalid credentials");
        } else {
            // create JWT
            const token = await jwt.sign({_id: user._id}, "DevTinder@2026", {expiresIn: "7d"});

            res.cookie("token", token, {expires: new Date(Date.now() + 7 * 86400000)});

            res.send("Login Successfull!!!");
        }
    } catch (e) {
        res.status(400).send("Error: " + e.message);
    }
});

app.post("/profile", authUser, async (req, res) => {
    try {
        const user = req.user;
        
        res.send(user);
    } catch (e) {
        res.status(400).send("Error: " + e.message);
    }
});

connectDB()
    .then(() => {
        console.log("connected to DB");
        app.listen(3000, () => {
            console.log("Server started running successfully!");
        });
    })
    .catch(e => {
        console.log(e)
    });
