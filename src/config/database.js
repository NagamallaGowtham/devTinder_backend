const mongoose = require("mongoose");

const connectDB = async function() {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
}

module.exports = {connectDB}