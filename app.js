const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'pug'); // set template engine
app.set('views', './views'); // pug files in views folder

const adminRoutes = require('./routes/admin'); // admin routes
const shopRoutes = require('./routes/shop'); //shop routes

const mongoose = require('mongoose');

const errorController = require('./controllers/errors'); //error page controller


const User = require('./models/User');

app.use(bodyParser.urlencoded({ extended: false })); //body parser
app.use(express.static(path.join(__dirname, 'public'))); // for static files images, css ...


app.use((req, res, next) => {
    User.findOne({ name: 'codintag' })
        .then(user => {
            req.user = user
            console.log(req.user);
            next();
        })
        .catch(err => console.log(err));
});

// routes
app.use('/admin', adminRoutes); //admin get and post products
app.use(shopRoutes); // shop get products
app.use(errorController.get404Page); //page not found


mongoose.connect('mongodb+srv://codintag:codintag@cluster0-yuiws.mongodb.net/node-app?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => {
        console.log("application connected to mongoDb");

        User.findOne({ name: 'codintag' })
            .then(user => {
                if (!user) {
                    user = new User({
                        name: 'codintag',
                        email: 'codintag@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    return user.save()
                }
                return user;
            })
            .then(user => {
                console.log(user);
            })
            .catch(err => console.log(err));


        app.listen(3000);
    })
    .catch(err => console.log(err));