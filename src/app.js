const express = require("express");

const app = express();

app.get("/user", (req, res) => {
    try {
        throw Error("error");
        res.send("user input");
    }
    catch(e) {
        res.status(500).send("Something went wrong!");
    }
});

app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("Something went wrong!");
    }
});

app.listen(3000, () => {
    console.log("Server started running successfully!");
});