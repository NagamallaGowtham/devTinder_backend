const express = require("express");
const {connectDB} = require("./config/database");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const {handleCheck} = require("./utils/handleChecks");

const app = express();

app.use(express.json());


// Delete the user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        await User.findByIdAndDelete(userId);
        res.send("Deleted the user");
    } catch(e) {
        res.status(404).send("Something went wrong");
    }
});

// update the user
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const ALLOWED_CHECKS = ["userId", "age", "profession"];
        let not_allowed_key = "";
        const is_allowed = Object.keys(data).every(k => {
            not_allowed_key = k;
            return ALLOWED_CHECKS.includes(k)
        });
        if (!is_allowed) {
            throw new Error(`Cant update ${not_allowed_key} field`);
        }
        await User.findByIdAndUpdate(userId, data, {runValidators: true});
        res.send("User updated successfully");
    } catch(e) {
        res.status(404).send("Something went wrong" + e.message);
    }
});

// update the user with emailId 
app.patch("/userWithEmailId", async (req, res) => {
    const emailId = req.body;
    console.log(emailId);
    try {
        await User.findOneAndUpdate(emailId, {"lastName": "rukmini", "emailId": "krishnaa@rukmini.com"}, {runValidators: true});
        res.send("User details updated");
    } catch(e) {
        res.status(404).send("Something went wrong");
    }
})

// GET user by Email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const users = await User.find({emailId: userEmail});
        if (!users.length) {
            res.status(404).send("user not found!");
        } else {
            res.send(users);
        }
    } catch(e) {
        res.status(404).send("Something went wrong!");
    }
});

// get all users data
app.get("/feed", async (req, res) => {
    try {
        const allUsers = await User.find({});
        if (!allUsers.length) {
            res.status(404).send("users not found!");
        } else {
            res.send(allUsers);
        }
    } catch(e) {
        res.status(404).send("Something went wrong!");
    }
});

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
            res.send("Hello User");
        }
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
