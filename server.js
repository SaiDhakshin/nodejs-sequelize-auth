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
const multer = require('multer');
const path = require('path');




const User = require('./models/User');
const Product = require("./models/products");
const Cart = require("./models/cart");
const CartItem = require("./models/cartItem");
const Order = require("./models/order");
const OrderItem = require("./models/orderItem");
const GUser = require("./models/GUser");

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');


//SMS
const accountSid = 'ACf5cc137857654a7e9148d95b3f689dbd';
const authToken = 'a07ccdbb0c73b81cad1600f4efb79c72';
const twilioNumber = '+13105792877';
const client = require('twilio')(accountSid, authToken);

//MAIL
const nodemailer = require('nodemailer');


const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// const intializePassport = require('./passportConfig');
const cookieParser = require('cookie-parser');

//encrypt session
app.use(session ({
    secret : 'secret',
    resave : false,
    saveUninitialized : false,
    store: myStore
}))


const fileStorage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'./images');
    },
    filename : (req,file,cb) => {
        cb(null,new Date().toISOString() + "-" + file.originalname);
    }
})

const fileFilter = (req,file,cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){

        cb(null,true);
    }else{

        cb(null,false);
    }
}

//config
app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));
app.use('/images',express.static(__dirname + '/images'));
// app.use(express.static(__dirname + '/ images'));

app.use(express.json());
app.use(express.urlencoded());

app.use(multer({storage : fileStorage , fileFilter : fileFilter}).single('imageUrl'));

app.use(flash());

app.use(cookieParser());

var myStore = new SequelizeStore({
    db: sequelize,
  });






app.use(passport.initialize());
app.use(passport.session());


// app.use((req,res ,next)=>{

//     GUser.findAll({where : {}}).then(user => {
//         req.user = user;
//         next();
//     }).catch(err => {
//         console.log(err);
//     })
// })

// app.use((req,res,next) => {
//     const { userId } = req.session;
//     if(userId){
//         res.locals.user = GUser.findAll({where : {id : userId}}).then(res => {
//             console.log(res);
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }
// })



// intializePassport(passport);


//Routes
app.use(authRoutes);
app.use(userRoutes);
app.use("/admin",adminRoutes);




//GOOGLE OAUTH



// passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'});










Product.belongsTo(User,{constraints : true , onDelete : 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product , {through : CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product , {through : OrderItem});

Product.belongsTo(GUser,{constraints : true , onDelete : 'CASCADE'});
Cart.belongsTo(GUser);
Order.belongsTo(GUser);
GUser.hasMany(Product);
GUser.hasOne(Cart);
GUser.hasMany(Order);
Order.belongsTo(GUser);

sequelize
// .sync({force : true})
.sync()
// .then(result => {
//     return GUser.findAll({where : {id : require.session.userId}});
// })
// .then(user => {
//     if(!user){
//         console.log("Cannot find user");
//     }
//     return user;
// })
// .then(user => {
//     console.log(user);
//     return user.createCart();
// })
.then(cart =>{
    console.log(cart);
    app.listen(port , ()=>{
        console.log("Server started listening at" + port);
    })
})
.catch(err=>{
    console.log(err);
})



myStore.sync().then(result => {
    console.log(result);
}).catch(err =>{
    console.log(err);
})