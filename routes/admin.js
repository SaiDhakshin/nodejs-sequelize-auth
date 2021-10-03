const express = require('express');

const router = express.Router();

const productController = require("../controllers/products");

const authController = require("../controllers/auth");

router.get("/register",authController.getAdminRegister);

router.post("/login",authController.postAdminLogin);

router.get("/add-products",productController.getAddProducts);

router.post("/add-products",productController.postAddProducts);

router.post("/delete/:id",productController.postDelete);

router.post("/update",productController.postUpdate);

module.exports = router;