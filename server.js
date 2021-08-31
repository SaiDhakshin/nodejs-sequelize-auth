const pool = require('./database');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');


const express = require('express');
const app = express();
const port = 3000;

const intializePassport = require('./passportConfig');
const cookieParser = require('cookie-parser');



//config
app.set('view engine','ejs');

app.use(express.json());
app.use(express.urlencoded());

app.use(flash());

app.use(cookieParser());

//encrypt session
app.use(session ({
    secret : 'secret',
    resave : false,
    saveUninitialized : false
}))



app.use(passport.initialize());
app.use(passport.session());



intializePassport(passport);

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
//Routes

app.get("/",checkAuthenticated,(req,res) => {
    res.render("index");
})

app.post("/register",checkAuthenticated, async (req,res) => {
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
    
})

// app.post("/login", (req,res) => {
//     res.render("login")
// });





app.post("/login", passport.authenticate('local',{
    successRedirect : "/dashboard",
    failureRedirect : "/login",
    failureFlash : true,
    successFlash : true
}))

app.get("/login",checkAuthenticated, (req,res) => {
    res.render("login");
})

app.get("/dashboard",(req,res) => {
    res.render("dashboard" , {user : req.user.name});
})

app.get("/test", (req,res) => {
    console.log("Get test");
    res.render("test" ,{name:req.name});
})

app.get("/logout",(req,res) => {
    req.logOut();
    req.flash("success_msg","You are logged out");
    res.redirect("/");
})

app.listen(port , ()=>{
    console.log("Server started listening at" + port);
})