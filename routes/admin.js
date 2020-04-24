const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin')

router.get('/products', adminController.getProducts);

// /admin/add-product=> GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product=> POST
router.post('/add-product', adminController.postAddProduct);

// /admin/edit-product=> GET
router.get('/products/:productid', adminController.getEditProduct);

// // /admin/edit-product=> POST
router.post('/products', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

router.get('/add-category', adminController.getAddCategory);

router.post('/add-category', adminController.postAddCategory);

router.get('/categories', adminController.getCategories);

// /admin/edit-category=> GET
router.get('/categories/:categoryid', adminController.getEditCategory);

// // /admin/edit-categories=> POST
router.post('/categories', adminController.postEditCategory);

module.exports = router;