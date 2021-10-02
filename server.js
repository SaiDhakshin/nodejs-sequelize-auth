// const pool = require('./database');
const sequelize = require('./util/sequelize');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const fs = require('fs');
require('./util/passport-OAuth');
// require('./passport-OAuth');
var SequelizeStore = require("connect-session-sequelize")(session.Store);


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');


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

// const intializePassport = require('./passportConfig');
const cookieParser = require('cookie-parser');

//encrypt session
app.use(session ({
    secret : 'secret',
    resave : false,
    saveUninitialized : false,
    store: myStore
}))


//config
app.set('view engine','ejs');

app.use(express.json());
app.use(express.urlencoded());

app.use(flash());

app.use(cookieParser());

var myStore = new SequelizeStore({
    db: sequelize,
  });






app.use(passport.initialize());
app.use(passport.session());



// intializePassport(passport);


//Routes
app.use(authRoutes);
app.use(userRoutes);




//GOOGLE OAUTH



// passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'});




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


sequelize.sync()
.then(result => {
    console.log(result);
})
.catch(err => {
    console.log(err);
})

app.listen(port , ()=>{
    console.log("Server started listening at" + port);
})

myStore.sync().then(result => {
    console.log(result);
}).catch(err =>{
    console.log(err);
})