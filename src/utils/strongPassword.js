const validator = require("validator");

const isPasswordStrong = (password) => {
    const isStrong = validator.isStrongPassword(password);

    return isStrong;
}

module.exports = isPasswordStrong;