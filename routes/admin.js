const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

const isAdmin = require('../middleware/isAdmin');
const csrf = require('../middleware/csrf');



router.get('/products', isAdmin, csrf, adminController.getProducts);

// /admin/add-product=> GET
router.get('/add-product', isAdmin, csrf, adminController.getAddProduct);

// /admin/add-product=> POST
router.post('/add-product', isAdmin, csrf, adminController.postAddProduct);

// /admin/edit-product=> GET
router.get('/products/:productid', isAdmin, csrf, adminController.getEditProduct);

// // /admin/edit-product=> POST
router.post('/products', isAdmin, csrf, adminController.postEditProduct);

router.post('/delete-product', isAdmin, csrf, adminController.postDeleteProduct);

router.get('/add-category', isAdmin, csrf, adminController.getAddCategory);

router.post('/add-category', isAdmin, csrf, adminController.postAddCategory);

router.get('/categories', isAdmin, csrf, adminController.getCategories);

// /admin/edit-category=> GET
router.get('/categories/:categoryid', isAdmin, csrf, adminController.getEditCategory);

// // /admin/edit-categories=> POST
router.post('/categories', isAdmin, csrf, adminController.postEditCategory);

router.post('/delete-category', isAdmin, csrf, adminController.postDeleteCategory);

module.exports = router;