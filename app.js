const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'pug'); // set template engine
app.set('views', './views'); // pug files in views folder

const adminRoutes = require('./routes/admin'); // admin routes
const shopRoutes = require('./routes/shop'); //shop routes
const errorController = require('./controllers/errors'); //error page controller

const mongoConnect = require('./utility/database').mongoConnect; //mongoDB

const User = require('./models/User');

app.use(bodyParser.urlencoded({ extended: false })); //body parser
app.use(express.static(path.join(__dirname, 'public'))); // for static files images, css ...

app.use((req, res, next) => {
    User.findByUserName('codintag')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            console.log(req.user);
            next();
        })
        .catch(err => console.log(err));
});

// routes
app.use('/admin', adminRoutes); //admin get and post products
app.use(shopRoutes); // shop get products
app.use(errorController.get404Page); //page not found

mongoConnect(() => {

    User.findByUserName('codintag')
        .then(user => {
            if (!user) {
                user = new User('codintag', 'codintag@gmail.com');
                return user.save()
            }
            return user;
        })
        .then(user => {
            console.log(user);
            app.listen(3000); // app listen on port 3000
        })
        .catch(err => console.log(err));
})