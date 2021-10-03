const Sequelize = require('sequelize');

const sequelize = require('../util/sequelize');

const Product = require('../models/products');

module.exports = class CartShop{
    static addProduct(id,productPrice){
        let cart = {products : [] , totalPrice : 0 };
        Product.findAll({where : {id : id}}).then( result => {
            console.log("DB rows" + result);
        }).catch(err => {
            console.log(err);
        })
        
        const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct;
        if(existingProduct){
            updatedProduct = { ...existingProduct};
            updatedProduct.qty = updatedProduct.qty + 1;
            cart.products = [...cart.products];
            cart.products[existingProductIndex] = updatedProduct;
        }else{
            updatedProduct = { id: id , qty : 1};
            cart.products = [ ...cart.products , updatedProduct];
        }
        cart.totalPrice = cart.totalPrice + +productPrice;
        console.log("This is cart" + cart);
        console.log("This is stringify cart" + JSON.stringify(cart));
        
    }
    
}