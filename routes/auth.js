

const express = require('express');

const router = express.Router();



const authController = require('../controllers/auth');
const OAuthController = require('../controllers/OAuth');

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

router.post("/register",checkAuthenticated,authController.register);

router.get("/auth/google",OAuthController.authGoogle);

router.get("/auth/google/callback" ,OAuthController.authGoogleCallBack);

// app.post("/login", (req,res) => {
//     res.render("login")
// });





router.post("/login",authController.postLogin);

router.get("/login",checkAuthenticated, authController.getLogin);

function isLoggedIn(req,res,next){
    req.user? next() : res.sendStatus(401);
}

router.get("/dashboard",isLoggedIn ,authController.getDashboard);


router.get("/logout",authController.getLogout);

module.exports = router;