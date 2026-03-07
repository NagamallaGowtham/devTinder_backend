const express = require("express");

const app = express();

// app.use("/user", (req, res) => {
//     res.send("Hello Ramaaaaaa");
// });

app.get("/user/:userId", (req, res) => {
    console.log(req.params);
    res.send({firstname: "Rama", lastname: "Sita"});
});

app.post("/user", (req, res) => {
    res.send("succesfullly posted");
});

app.delete("/user", (req, res) => {
    res.send("deleted the user");
});

app.listen(3000, () => {
    console.log("Server started running successfully!");
});