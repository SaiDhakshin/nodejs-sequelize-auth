const pool = require('../util/database');
const passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const GUser = require("../models/GUser");

require('dotenv').config();



// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: "https://localhost:3000/auth/google/callback",
    callbackURL: "/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
      console.log("OAuth ran");

      GUser.findAll({where : {email : profile.email}}).then(users =>{
          if(users[0]){
            console.log('OAuth eval success');
              return done(null, profile);
          }else{
              GUser.create({
                  id : profile.id,
                  name : profile.displayName,
                  email : profile.email
              }).then(result => {
                  console.log(result);
                  return done(null, profile);
              })
              .catch(err => {
                  console.log(err);
              })
          }
      }).catch(err => {
          console.log(err);
      })
    
    // pool.query("SELECT * FROM oauth_table WHERE email = ($1)",[profile.email],(err,result) => {
    //     if(err){
    //         throw err;
    //     }
    //     if(result.rows.length > 0){
    //         console.log('OAuth eval success');
    //         return done(null, profile);
    //     }else{
    //         pool.query("INSERT INTO oauth_table (id,displayName,email) VALUES ($1,$2,$3) RETURNING id ",[profile.id,profile.displayName,profile.email]
    //         ,(err,result) => {
    //             if(err){
    //                 throw err;
    //             }
    //             console.log(result.rows);
                
                
                
    //         })
    //         return done(null, profile);
    //     }
        
        
            
        
    // })
      
    
  }
));

passport.serializeUser((user,done)=>{
    console.log(user.id);
    done(null,user.id);
    console.log("OAuth");
})


passport.deserializeUser((id,done)=>{
    GUser.findAll({where : {id : id}}).then(users => {
        console.log("Oauth des");
        return done(null,users[0]);
    }).catch(err => {
        console.log(err);
    })
    // pool.query("SELECT * FROM oauth_table WHERE id = $1",[id],(err,result)=>{
    //     if(err){
    //         throw err;
    //     }
        
    })



