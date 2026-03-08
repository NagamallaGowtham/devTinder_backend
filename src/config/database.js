const mongoose = require("mongoose");

const connectDB = async function() {
    await mongoose.connect("mongodb+srv://nagamallagowtham_db_user:xmK5sgYJYEABbhvb@namastenode.byydu0x.mongodb.net/");
}

module.exports = {connectDB}