const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Admin = require("../models/admin");
const GUser = require("../models/GUser");

const intializePassport = require('../util/passportConfig');

intializePassport(passport);

exports.register = async (req,res) => {
    console.log(req.body);
    let {name , email , password , password2} = req.body;
    const emaile = req.body.email;
    console.log(name , email , password , password2);
    let errors = [];
    if(!name || !email || !password || !password2){
        errors.push({message : "Please enetr all fields!"});
    }
    if(password.length < 6){
        errors.push({message : "Password length must be greater than 6"});
    }
    if(password2 != password){
        errors.push({message : "Passwords do not match!"});
    }
    if(errors.length > 0){
        res.render("index" , {errors});
    }
    let hashedPassword = await bcrypt.hash(password,10);
    User.findAll({ where : { email : emaile }}).then(users => {
        if(users[0]){
            console.log(users);
            errors.push({message : "Email exists"});
            res.render("index",{errors});
        }else{
            User.create({
                name : name,
                email : email,
                password : hashedPassword
            }).then( result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            })
            req.flash('success_msg' , "You are now registered . Please Login");
            res.redirect("/login");

        }
    }).catch(err => {
        console.log(err);
    })
    // pool.query("SELECT * FROM user_table WHERE email = ($1)",[email],(err,result) => {
    //     if(err){
    //         throw err;
    //     }
    //     console.log(result.rows);
    //     if(result.rows.length > 0){
    //         errors.push({message : "Email Exists!"});
    //         res.render("index",{errors});
    //     }else{
    //         pool.query("INSERT INTO user_table (name,email,password) VALUES ($1,$2,$3) RETURNING id , password",[name,email,hashedPassword]
    //         ,(err,result) => {
    //             if(err){
    //                 throw err;
    //             }
    //             console.log(result.rows);
    
    //         })
    //     }
    // })
    

    
    console.log(hashedPassword);
    
}

exports.getAdminRegister = async (req,res) => {
    console.log(req.body);
    let {name , email , password , password2} = req.body;
    const emaile = req.body.email;
    console.log(name , email , password , password2);
    let errors = [];
    if(!name || !email || !password || !password2){
        errors.push({message : "Please enter all fields!"});
    }
    if(password.length < 6){
        errors.push({message : "Password length must be greater than 6"});
    }
    if(password2 != password){
        errors.push({message : "Passwords do not match!"});
    }
    if(errors.length > 0){
        res.render("index" , {errors});
    }
    let hashedPassword = await bcrypt.hash(password,10);
    Admin.findAll({ where : { email : emaile }}).then(admins => {
        if(admins[0]){
            console.log(admins);
            errors.push({message : "Email exists"});
            res.render("index",{errors});
        }else{
            Admin.create({
                name : name,
                email : email,
                password : hashedPassword
            }).then( result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            })
            req.flash('success_msg' , "You are now registered . Please Login");
            res.redirect("/admin/login");

        }
    }).catch(err => {
        console.log(err);
    })
    // pool.query("SELECT * FROM user_table WHERE email = ($1)",[email],(err,result) => {
    //     if(err){
    //         throw err;
    //     }
    //     console.log(result.rows);
    //     if(result.rows.length > 0){
    //         errors.push({message : "Email Exists!"});
    //         res.render("index",{errors});
    //     }else{
    //         pool.query("INSERT INTO user_table (name,email,password) VALUES ($1,$2,$3) RETURNING id , password",[name,email,hashedPassword]
    //         ,(err,result) => {
    //             if(err){
    //                 throw err;
    //             }
    //             console.log(result.rows);
    
    //         })
    //     }
    // })
    

    
    console.log(hashedPassword);
    
}

exports.postAdminLogin = passport.authenticate('local',{
    successRedirect : "/dashboard",
    failureRedirect : "/admin/login",
    failureFlash : true,
    successFlash : true
})

exports.postLogin = passport.authenticate('local',{
    successRedirect : "/dashboard",
    failureRedirect : "/login",
    failureFlash : true,
    successFlash : true
})

exports.getLogin = (req,res) => {
    res.render("login");
}

exports.getDashboard = (req,res) => {
    // res.render("dashboard" , {user : req.user.name});
    console.log("Req user" + req.user);
    req.session.userId = req.user.id;
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    req.user.createCart()
    .then(result => {
        console.log("Cart Created");
        console.log(result);
        console.log(result.dataValues);
    })
    .catch(err => {
        console.log(err);
    })
    res.render("dashboard" , {user : req.user.displayname|| req.user.name});
}

exports.getLogout = (req,res) => {
    // req.logOut();
    req.flash("success_msg","You are logged out");
    req.session.destroy();
    req.logOut();
    res.redirect("/");
}