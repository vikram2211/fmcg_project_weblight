const express = require('express');
const router = express.Router();

const userController = require('../Controllers/userController');
const productController = require('../Controllers/productController');

/* User Routes */
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);


/* Product Routes */
router.post("/create", productController.createProduct);
router.get("/get", productController.getProducts);
router.get("/get", productController.getProducts);
router.put("/update/productId/:productId", productController.updateProduct);
router.delete("/delete/productId/:productId", productController.deleteProduct);


module.exports = router;
