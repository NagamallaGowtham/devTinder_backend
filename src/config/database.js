const mongoose = require("mongoose");

const connectDB = async function() {
    await mongoose.connect("mongodb+srv://nagamallagowtham_db_user:Fe7xAi8ITx3mrAC6@namastenode.byydu0x.mongodb.net/devTinder");
}

module.exports = {connectDB}