const pool = require('../util/database');
const Product = require('../models/products');
const GUser = require("../models/GUser");

const CartShop = require('../models/cartshop');
const Sequelize = require('sequelize');




const sequelize = require('../util/database');

exports.getAddProducts =(req,res)=>{
    const edit = false;
    console.log("GETADD");
    res.render("add-products" , {edit : edit});
}

exports.postAddProducts = async (req,res)=>{
    console.log(req.body);
    let{name,price,description} = req.body;
    let imageUrl = req.file;
    console.log(req.session.userId);
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })

    if(!imageUrl){
        req.flash('success_msg', 'Attached file not a valid image');
        console.log('/admin/add-product works');
        res.redirect("/admin/add-products"); 
    }
    const imagePath = imageUrl.path;
    req.user.createProduct({
        title : name,
        price : price,
        imageUrl : imagePath,
        description : description
    })
    //  Product.create({
    //     title : name,
    //     price : price,
    //     imageUrl : imageUrl,
    //     description : description,
    //     userId : req.user.id
    // })
    .then(result =>{
        console.log(result);
        console.log(result.dataValues);
        req.flash('success_msg',result.dataValues.title + ' Product successfully Added');
        console.log('/admin/add-product works');
        res.redirect("/admin/add-products");  
    }).catch(err =>{
        console.log(err);
    })
    // await pool.query("INSERT INTO product_table (name,price,imageUrl,description) VALUES ($1,$2,$3,$4) RETURNING *",[name,price,imageUrl,description],(err,res)=>{
    //     if(err){
    //         throw err;
    //     }
       
    // });
    
     
}

exports.getProducts =async (req,res)=>{
    console.log("getProducts ran" );
    // await pool.query("SELECT * FROM product_table",(err,result)=>{
    //     if(err){
    //         throw err;
    //     }
    //     if(result.rows.length > 0){
    //         console.log(result.rows);
    //         // products.push(result.rows);
    //         res.render('products',{products : result.rows});
    //     }
    // })
    await Product.findAll().then(products =>{
        // console.log(products);
        res.render('products',{products : products});
    }).catch(err=>{
        console.log(err);
    })
}

exports.getProductId =  async(req,res) =>{
    const edit = req.query.edit;
    const id = req.params.id;
    if(edit){
        await Product.findAll({where : {id : id}}).then(products =>{
            // console.log(products);
            res.render('add-products',{edit : edit , prods : products[0]});
        }).catch(err=>{
            console.log(err);
        })
        
    }else{
        const id = req.params.id;
    console.log(req.query);
    await Product.findAll({where : {id : id}}).then(products => {
        console.log(products);
        const product = products[0];
        res.render('productDetail',{p : product});
    }).catch(err=>{
        console.log(err);
    })
    }
    
}

exports.postEditProduct = async(req,res)=>{
    const edit = req.query.edit;
    if(edit){
        res.render('add-products',{edit : edit});
    }
    
}

exports.getCart = async(req,res) =>{
    // const cartProducts = CartShop.getCartProducts();
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    req.user.getCart()
    // Cart.findAll()
    .then(cart =>{
        return cart.getProducts()
        .then(prods =>{
            console.log( "carts "  + prods);
            res.render("cart",{p : prods});
        })
        .catch(err =>{
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
    
}

exports.postCart = async (req,res) => {
    console.log(req.body);
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    const id = req.body.id;
    console.log(id);
    let fetchedCart ;
    let newQuantity = 1;
    req.user.getCart()
    .then(cart =>{
        fetchedCart = cart;
        console.log(fetchedCart);
        return cart.getProducts({where : {id : id}});
    })
    .then(p =>{
        let product;
        if(p.length > 0){
            product = p[0];
        }
        
        if(product){
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
        }
        return Product.findByPk(id)
        // .then(p =>{
        //     return fetchedCart.addProduct(p , { through  : { quantity : newQuantity }});
        // })
    })
        .then(p => {
            return fetchedCart.addProduct(p , { through  : { quantity : newQuantity }});
        })
        
        .then(() =>{
            console.log("Cart Redirect");
            req.flash('success_msg',' Product successfully Added');
            res.redirect("/products");
        })
        
        .catch(err =>{const id = req.body.id;
            console.log(id);
            let fetchedCart ;
            let newQuantity = 1;
            req.user.getCart()
            .then(cart =>{
                fetchedCart = cart;
                console.log(fetchedCart);
                return cart.getProducts({where : {id : id}});
            })
            console.log(err);
        })
   
        
    // Product.findById(id , (product) =>{
    //     Cart.addProduct(id , product.price);
    // })
}

exports.addCartQty = (req,res) => {
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    const id = req.body.id;
    console.log(id);
    let fetchedCart ;
    req.user.getCart()
    .then(cart =>{
        fetchedCart = cart;
        console.log(fetchedCart);
        return cart.getProducts({where : {id : id}});
    })
    .then(p =>{
        let product;
        if(p.length > 0){
            product = p[0];
        }
        
        if(product){
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
        }
        return Product.findByPk(id)
        // .then(p =>{
        //     return fetchedCart.addProduct(p , { through  : { quantity : newQuantity }});
        // })
    })
        .then(p => {
            return fetchedCart.addProduct(p , { through  : { quantity : newQuantity }});
        })
        
        .then(() =>{
            console.log("Cart Redirect");
            req.flash('success_msg',' Qty successfully Added');
            res.redirect("/cart");
        })
        
        .catch(err =>{
            console.log(err);
        })
}

exports.removeQtyCart = (req,res) => {
    let noQty;
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    const id = req.body.id;
    console.log(id);
    let fetchedCart ;
    req.user.getCart()
    .then(cart =>{
        fetchedCart = cart;
        console.log(fetchedCart);
        return cart.getProducts({where : {id : id}});
    })
    .then(p =>{
        let product;
        if(p.length > 0){
            product = p[0];
        }
        
        if(product){
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity - 1;
            if(newQuantity < 1){
                product.cartItem.destroy();
            }
            return product;
        }
        return Product.findByPk(id)
        // .then(p =>{
        //     return fetchedCart.addProduct(p , { through  : { quantity : newQuantity }});
        // })
    })
        .then(p => {
 
                return fetchedCart.addProduct(p , { through  : { quantity : newQuantity }});

        })
        
        .then(() =>{
            console.log("Cart Redirect");
            req.flash('success_msg',' Qty successfully Deleted!');
            res.redirect("/cart");
        })
        
        .catch(err =>{
            console.log(err);
        })
}

exports.postDelete = async (req,res)=>{
    const id = req.params.id;
    await Product.findByPk(id).then(product =>{
        return product.destroy();
    }).then(result => {
        console.log("Product Deleted!");
        res.redirect('/products');
    })
    .catch(err => {
        console.log(err);
    })

    
}

exports.postUpdate = async (req,res) =>{
    const id = req.body.id;
    let{name,price,description} = req.body;
    let imageUrl = req.file;
    if(!imageUrl){
        req.flash("success_msg","Not a valid image");
        res.render('add-products',{edit : edit});
    }

    const imagePath = imageUrl.path;
    await Product.findByPk(id).then(product =>{
            product.title = name;
            product.price = price;
            product.imageUrl = imagePath;
            product.description = description;
             return product.save();
    })
    .then(result => {
        console.log("Updated product"  + result);
        res.redirect("/products");
    })
    .catch(err =>{
        console.log(err);
    })
}

exports.postOrder = (req,res) =>{
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    let fetchedCart;
    req.user.getCart()
    .then(cart =>{
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products =>{
        return req.user.createOrder()
        .then(order =>{
            return order.addProducts(products.map(product =>{
                product.orderItem = { quantity : product.cartItem.quantity };
                return product;
            }))
        })
        .catch(err =>{
            console.log(err);
        })
    })
    .then(result => {
        console.log(result);
        console.log("Cart emptied");
        return fetchedCart.setProducts(null);
    })
    .then(result =>{
        res.redirect("/orders");
        
    })
    .catch(err =>{
        console.log(err);
    })
}

exports.getOrder = (req,res) =>{
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    req.user.getOrders({include : ['products']})
    .then(orders => {
        res.render("orders",{orders : orders});

    })
    .catch(err =>{
        console.log(err);
    })
}