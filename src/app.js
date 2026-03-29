const express = require("express");
const {connectDB} = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


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
