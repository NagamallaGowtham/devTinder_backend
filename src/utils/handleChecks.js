const handleCheck = (req) => {
    const {firstName, lastName} = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is required for signing up");
    }
}

module.exports = {handleCheck}