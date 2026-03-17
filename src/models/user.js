const mongoose = require("mongoose");
const validator = require("validator");

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
            if (!validator.isEmail(email)) {
                throw new Error("Please enter a valid email id");
            }
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