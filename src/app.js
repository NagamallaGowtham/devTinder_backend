const express = require("express");

const app = express();

app.use("/user", [(req, res, next) => {
    // res.send("Handler 1");
    next();
}, (req, res, next) => {
    // res.send("Handler 2");
    next();
}], (req, res, next) => {
    next();
    res.send("Handler 3");
});

app.listen(3000, () => {
    console.log("Server started running successfully!");
});