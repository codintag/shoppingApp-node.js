const Product = require('../models/Product');
const Category = require('../models/Category');


exports.getIndex = (req, res, next) => {

    Product.getAll()
        .then(products => {
            Category.getAll()
                .then(categories => {
                    res.render('shop/index',
                        {
                            title: 'Shopping',
                            products: products[0],
                            categories: categories[0],
                            path: '/'
                        });
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err));


}

exports.getProducts = (req, res, next) => {

    Product.getAll()
        .then(products => {
            Category.getAll()
                .then(categories => {
                    res.render('shop/products',
                        {
                            title: 'products',
                            products: products[0],
                            categories: categories[0],
                            path: '/products'
                        })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err));
}

exports.getProductsByCategoryId = (req, res, next) => {
    const categoryid = req.params.categoryid;
    const products = Product.getProductsByCategoryId(categoryid);
    const categories = Category.getAll();
    res.render('shop/products',
        {
            title: 'Products',
            products: products,
            categories: categories,
            selectedCategory: categoryid,
            path: '/products'
        });
}

exports.getProduct = (req, res, next) => {
    Product.getById(req.params.productid)
        .then(product => {
            console.log(product[0][0])
            res.render('shop/product-detail',
                {
                    title: product[0][0].name,
                    product: product[0][0],
                    path: '/products'
                });
        })
        .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart',
        {
            title: 'Cart',
            path: '/cart'
        });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders',
        {
            title: 'Details',
            path: '/orders'
        });
}
