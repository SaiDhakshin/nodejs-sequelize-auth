const pool = require('./database');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const fs = require('fs');
require('./passport-OAuth');

//SMS
const accountSid = 'ACf5cc137857654a7e9148d95b3f689dbd';
const authToken = 'a07ccdbb0c73b81cad1600f4efb79c72';
const twilioNumber = '+13105792877';
const client = require('twilio')(accountSid, authToken);

//MAIL
const nodemailer = require('nodemailer');


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

app.get("/dashboard",isLoggedIn ,(req,res) => {
    // res.render("dashboard" , {user : req.user.name});
    console.log(req.user);
    res.render("dashboard" , {user : req.user.displayname|| req.user.name});
})


app.get("/logout",(req,res) => {
    req.logOut();
    req.flash("success_msg","You are logged out");
    res.redirect("/");
})

//GOOGLE OAUTH

function isLoggedIn(req,res,next){
    req.user? next() : res.sendStatus(401);
}

// passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'});


app.get("/auth/google",
    passport.authenticate('google' ,{ scope : ['email','profile']})
);

app.get("/auth/google/callback" , passport.authenticate('google' , {
    successRedirect:"/dashboard",
    failureRedirect:"/"
}))


//SEND SMS
app.get("/phone", (req,res) => {
    res.render("phone");
})

app.post("/send",async (req,res) => {
    console.log(req.body);
    client.messages
    .create({
       body: 'Hello' + req.body.username,
       from: twilioNumber,
       to: '+91' + req.body.phonenumber
     })
    .then(message => console.log(message.sid));
    res.send("Sent SMS");
})

app.get("/mail",(req,res) => {
    res.render("mail");
})

app.post("/mail",async (req,res) => {

    let transporter = nodemailer.createTransport({
        host : "smtp.gmail.com",
        port : 587,
        secure : false,
        auth : {
            user : "saidhakshin75@gmail.com",
            pass : "qmpzFGH4563",
        },
    });

    const options = {
        from : 'saidhakshin75@gmail.com',
        to : '19p233@kce.ac.in',
        subject : "Hello",
        text : "Hello World?",
        html : '<b>Hello World?</b>',
    }

    transporter.sendMail(options,function(err,info){
        if(err){
            console.log(err);
            return;
        }
        console.log("sent:" + info.response);

        console.log("Message sent : %s" , info.messageId);

        console.log("Preview URL : %s",nodemailer.getTestMessageUrl(info));
    })

  

    res.send("Sent");
})

//VIDEO
app.get("/video",(req,res) => {
    res.render("video");
})

app.get('/videoplay',(req,res)=>{
    console.log(req.headers.range);
    const range = req.headers.range;
    console.log(range);
    if(!range){
        res.status(400).send('Required header not found');
    }
    const videoPath = ("./videos/buggy.mp4");
    const videoSize = fs.statSync("./videos/buggy.mp4").size;

    const CHUNK_SIZE = 10 ** 6;//1mb
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK_SIZE , videoSize-1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range" : `bytes ${start} - ${end} / ${videoSize}`,
        "Accept-Ranges" : "bytes",
        "Content-Length" : contentLength,
        "Content-Type" : "video/mp4",
    };

    res.writeHead(206,headers);

    const videoStream = fs.createReadStream(videoPath,{start,end});

    videoStream.pipe(res);
});

app.listen(port , ()=>{
    console.log("Server started listening at" + port);
})