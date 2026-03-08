const express = require("express");
const {connectDB} = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());


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
    const user = new User(req.body);

    try {
        await user.save();
        res.send("user saved successfully");
    } catch(e) {
        res.status(400).send("Something went wrong");
    }
})

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
