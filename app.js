const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'pug'); // set template engine
app.set('views', './views'); // pug files in views folder

const adminRoutes = require('./routes/admin'); // admin routes
const shopRoutes = require('./routes/shop'); //shop routes
const errorController = require('./controllers/errors'); //error page controller

const sequelize = require('./utility/database');

const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

app.use(bodyParser.urlencoded({ extended: false })); //body parser
app.use(express.static(path.join(__dirname, 'public'))); // for static files images, css ...

app.use((req, res, next) => (
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
));

// routes
app.use('/admin', adminRoutes); //admin get and post products
app.use(shopRoutes); // shop get products
app.use(errorController.get404Page); //page not found

//relations one to many / many to one (sequelize)
Product.belongsTo(Category, { foreignKey: { allowNull: false } });
Category.hasMany(Product);

Product.belongsTo(User);
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });


let _user;
sequelize//.sync({ force: true })    //create table in database
    .sync()
    .then(() => {
        User.findByPk(1)
            .then(user => {
                if (!user) {
                    User.create({ name: 'codintag', email: 'codintag@gmail.com' })
                }
                return user;
            }).then(user => {

                _user = user;
                return user.getCart();
            }).then(cart => {
                if (!cart) {
                    return _user.createCart();
                }
                return cart;
            }).then(() => {
                Category.count()
                    .then(count => {
                        if (count === 0) {
                            Category.bulkCreate([
                                { name: 'Smartphone', description: 'Smartphone categories' },
                                { name: 'Computer', description: 'Computers categories' },
                                { name: 'Electromenager', description: 'Electromenager categories' }
                            ]);
                        }
                    })
            });
    })
    .catch(err => console.log(err));

app.listen(3000, () => {
    console.log('listening on port 3000');
}); // app listen on port 3000
