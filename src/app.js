const express = require("express");
const {connectDB} = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

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
