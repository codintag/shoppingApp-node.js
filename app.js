const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'pug'); // set template engine
app.set('views', './views'); // pug files in views folder

const adminRoutes = require('./routes/admin'); // admin routes
const shopRoutes = require('./routes/shop'); //shop routes

const errorController = require('./controllers/errors'); //error page controller

app.use(bodyParser.urlencoded({ extended: false })); //body parser
app.use(express.static(path.join(__dirname, 'public'))); // for static files images, css ...

// routes
app.use('/admin', adminRoutes); //admin get and post products
app.use(shopRoutes); // shop get products
app.use(errorController.get404Page); //page not found

app.listen(3000, () => {
    console.log('listening on port 3000');
}); // app listen on port 3000
