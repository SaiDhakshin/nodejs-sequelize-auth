const passport = require('passport');
const bcrypt = require('bcrypt');

const intializePassport = require('../util/passportConfig');

intializePassport(passport);

exports.register = async (req,res) => {
    console.log(req.body);
    let {name , email , password , password2} = req.body;
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
    pool.query("SELECT * FROM user_table WHERE email = ($1)",[email],(err,result) => {
        if(err){
            throw err;
        }
        console.log(result.rows);
        if(result.rows.length > 0){
            errors.push({message : "Email Exists!"});
            res.render("index",{errors});
        }else{
            pool.query("INSERT INTO user_table (name,email,password) VALUES ($1,$2,$3) RETURNING id , password",[name,email,hashedPassword]
            ,(err,result) => {
                if(err){
                    throw err;
                }
                console.log(result.rows);
                req.flash('success_msg' , "You are now registered . Please Login");
                res.redirect("/login");
                
            })
        }
    })

    
    console.log(hashedPassword);
    
}

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
    console.log(req.user);
    res.render("dashboard" , {user : req.user.displayname|| req.user.name});
}

exports.getLogout = (req,res) => {
    req.logOut();
    req.flash("success_msg","You are logged out");
    res.redirect("/");
}