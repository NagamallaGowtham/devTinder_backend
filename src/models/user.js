const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: (email) => {
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    profession: {
        type: String,
        default: "Dev"
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;