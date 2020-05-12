const User = require('../models/User');
const Login = require('../models/Login');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const nodemailer = require('nodemailer');
require('dotenv').config();


const nodemail = require('../utility/nodemailer');

exports.getLogin = (req, res, next) => {
    let errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('account/login', {
        path: '/login',
        title: 'Login',
        errorMessage: errorMessage
    })
}

exports.postLogin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    const loginModel = new Login({
        email: email,
        password: password
    })

    loginModel
        .validate()
        .then(() => {
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        req.session.errorMessage = 'This E-mail does not exists, please try again!';
                        req.session.save(err => {
                            console.log(err)
                            return res.redirect('/login');
                        })
                    }

                    bcrypt.compare(password, user.password)
                        .then(isSuccess => {
                            if (isSuccess) {
                                req.session.user = user;
                                req.session.isAuthenticated = true;
                                return req.session.save(function (err) {

                                    const url = req.session.redirectTo || '/'
                                    delete req.session.redirectTo;
                                    return res.redirect(url);
                                })
                            }
                            req.session.errorMessage = 'E-mail or password Error, please try again!';
                            req.session.save(err => {
                                console.log(err)
                                return res.redirect('/login');
                            })
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        })
        .catch(err => {
            if (err.name == 'ValidationError') {
                let message = '';
                for (field in err.errors) {
                    message += err.errors[field].message + '<br>'
                }

                res.render('account/login', {
                    path: '/login',
                    title: 'Login',
                    errorMessage: message
                })
            } else {
                next(err);
            }
        })


}

exports.getRegister = (req, res, next) => {
    let errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('account/register', {
        path: '/register',
        title: 'Register',
        errorMessage: errorMessage
    })
}

exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.session.errorMessage = 'Cet adresse e-mail existe déjà.';
                req.session.save(err => {
                    console.log(err)
                    return res.redirect('/register');
                })
            }

            return bcrypt.hash(password, 12);

        }).then(hashedPassword => {
            console.log(hashedPassword);

            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return newUser.save();
        })
        .then(() => {

            res.redirect('/login');

            //nodemailer
            nodemail(email);
        })
        .catch(err => {
            if (err.name == 'ValidationError') {
                let message = '';
                for (field in err.errors) {
                    message += err.errors[field].message + '<br>'
                }

                res.render('account/register', {
                    path: '/register',
                    title: 'Register',
                    errorMessage: message
                })
            } else {
                next(err);
            }
        });
}

exports.getReset = (req, res, next) => {

    let errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('account/reset', {
        path: '/reset-password',
        title: 'Reset Password',
        errorMessage: errorMessage
    })
}

exports.postReset = (req, res, next) => {

    const email = req.body.email

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('reset-password');
        }
        const token = buffer.toString('hex');

        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.session.errorMessage = 'Adresse E-mail n\'a pas été retrouvé';
                    req.session.save(err => {
                        console.log(err)
                        return res.redirect('/reset-password');

                    })
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;

                return user.save()

            }).then(result => {
                res.redirect('/');
                //send email

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
                    subject: 'codintag ShoppApp informations - Password reset',
                    html: `
                        <h2> Password Reset </h2>
                        <p>click on the link below to reset your Paswword /p>
                        <p>
                            <a href="http://localhost:3000/reset-password/${token}">Reset Password </a>
                        </p>
                    `
                }

                return transporter.sendMail(mailOptions)
                    .then(() => {
                        console.log('E-mail send');
                    })
                    .catch(err => {
                        next(err);
                    })

                // end of send email
            })
    })
}

exports.getNewPassword = (req, res, next) => {

    let errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    const token = req.params.token;

    User.findOne({
        resetToken: token, resetTokenExpiration: {
            $gt: Date.now()
        }
    }).then(user => {
        res.render('account/new-password', {
            path: '/new-password',
            title: 'New Password',
            errorMessage: errorMessage,
            userId: user._id.toString(),
            passwordToken: token
        })
    }).catch(err => {
        next(err);
    })
}

exports.postNewPassword = (req, res, next) => {

    const newPassword = req.body.password;
    const userId = req.body.userId;
    const token = req.body.passwordToken;
    let _user;

    User.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now()
        },
        _id: userId
    }).then(user => {
        _user = user;
        return bcrypt.hash(newPassword, 10);
    }).then(hashedPassword => {
        _user.password = hashedPassword;
        _user.resetToken = undefined;
        _user.resetTokenExpiration = undefined;

        return _user.save();
    }).then(() => {
        res.redirect('/login');
    }).catch(err => console.log(err));
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/')
    })
}