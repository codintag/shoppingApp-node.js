const mongoose = require('mongoose');
const { isEmail } = require('validator');

const loginSchema = mongoose.Schema({

    email: {
        type: String,
        validate: [isEmail, 'E-mail is not valide']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password']
    }
});



module.exports = mongoose.model("Login", loginSchema);