const express = require('express');

const router = express.Router();

const productController = require('../controllers/products');

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect("/dashboard");
    }
    next();
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

router.get("/",checkAuthenticated,(req,res) => {
    res.render("index");
})

router.get("/products",productController.getProducts);

router.get("/products/:id",productController.getProductId);



router.get("/cart",productController.getCart);

router.post("/cart",productController.postCart);

router.post("/createorder",productController.postOrder);

router.get("/orders",productController.getOrder);

module.exports = router;