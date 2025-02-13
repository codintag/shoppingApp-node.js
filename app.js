const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

app.set('view engine', 'pug'); // set template engine
app.set('views', './views'); // pug files in views folder

const adminRoutes = require('./routes/admin'); // admin routes
const shopRoutes = require('./routes/shop'); //shop routes
const accountRoutes = require('./routes/account'); //account routes

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf'); // csrf
const multer = require('multer');

const errorController = require('./controllers/errors'); //error page controller


const User = require('./models/User');

const store = new mongoDbStore({
    uri: process.env.CONNECTION_MONGO,
    collection: 'mySessions'
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/img/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // for get not similar image names
    }
})

app.use(bodyParser.urlencoded({ extended: false })); //body parser
app.use(multer({
    storage: storage
}).single('image'))
app.use(cookieParser());
app.use(session({
    secret: 'codintag',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000
    },
    store: store
}));
app.use(express.static(path.join(__dirname, 'public'))); // for static files images, css ...


app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user
            console.log(req.user);
            next();
        })
        .catch(err => console.log(err));
});

app.use(csurf());

// routes
app.use('/admin', adminRoutes); //admin get and post products
app.use(shopRoutes); // shop get products
app.use(accountRoutes); // account

//app.use('/500', errorController.get500Page);
app.use(errorController.get404Page); //page not found
app.use((error, req, res, next) => {
    console.log(err);
    res.status(500).render('error/500', {title: 'Error'})
})


mongoose.connect(process.env.CONNECTION_MONGO, { useNewUrlParser: true })
    .then(() => {
        console.log("Application connected to mongoDb");
        app.listen(process.env.PORT);
    })
    .catch(err => console.log(err));