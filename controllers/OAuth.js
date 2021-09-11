require('../util/passport-OAuth');
const passport = require('passport');



exports.authGoogle = passport.authenticate('google' ,{ scope : ['email','profile']});

exports.authGoogleCallBack =  passport.authenticate('google' , {
    successRedirect:"/dashboard",
    failureRedirect:"/"
});


