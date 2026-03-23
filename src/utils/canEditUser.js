const isFieldsCanEdit = (req) => {
    const fieldsAllowedToEdit = ["firstName", "lastName", "age", "gender", "profession"];

    return Object.keys(req.body).every(field => fieldsAllowedToEdit.includes(field));
}

module.exports = isFieldsCanEdit