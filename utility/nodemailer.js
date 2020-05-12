const nodemailer = require('nodemailer');
require('dotenv').config();

// here nodemailer
let transporter = (email) => {


    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });


    let mailOptions = {
        from: 'From : <codintag@gmail.com>',
        to: email,
        subject: 'codintag ShoppApp informations',
        text: 'Your account has been created with success'
    }

    return transporter.sendMail(mailOptions)
        .then(() => {
            console.log('E-mail send');
        })
        .catch(err => console.log('An error has occured', err))

}

module.exports = transporter;