const express = require("express");

const app = express();

const { auth } = require("./middlewares/auth");

// app.use("/admin", auth);

app.get("/user", (req, res) => {
    res.send("user request");
})

app.get("/admin/deleteUser", auth, (req, res) => {
    res.send("deleted user");
});
app.get("/admin/loginUser", auth, (req, res) => {
    res.send("login successfully");
});


app.listen(3000, () => {
    console.log("Server started running successfully!");
});