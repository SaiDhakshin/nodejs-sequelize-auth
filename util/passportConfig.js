const LocalStrategy = require('passport-local');
const pool = require('../util/database');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');

//LOCAL STRATEGY


const authenticateUser = (email,password,done) =>{

    User.findAll({where : {email : email}}).then(users => {
        if(users[0]){
            console.log(users[0]);
            const user = users[0];
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err){
                    throw err;
                }
                if(isMatch){
                    console.log("Evaluation sucess!");
                    return done(null,user);
                }else{
                    return done(null,false,{message : "Password is not correct!"});
                }
            })
        }
        else{
            return done(null,false,{message : "Email not registered!"});
        }
    }).catch(err => {
        console.log(err);
    })


    // pool.query("SELECT * FROM user_table WHERE email=($1)",[email],(err,result) => {
    //     if(err){
    //         throw err;
    //     }
    //     if(result.rows.length > 0){
    //         const user = result.rows[0];
    //         console.log(result.rows[0]);

    //         bcrypt.compare(password,user.password,(err,isMatch)=>{
    //             if(err){
    //                 throw err;
    //             }
    //             if(isMatch){
    //                 console.log("Evaluation sucess!");
    //                 return done(null,user);
    //             }else{
    //                 return done(null,false,{message : "Password is not correct!"});
    //             }
    //         })
    //     }else{
    //         return done(null,false,{message : "Email not registered!"});
    //     }
    // })
}

function initialize(passport){
    passport.use(new LocalStrategy({
        usernameField : "email",
        passwordField : "password"
    },authenticateUser))
}



passport.serializeUser((user,done)=>{
    done(null,user.id);
    console.log("Passport Config");
})


passport.deserializeUser((id,done)=>{
    User.findAll({where : {id : id}}).then(users => {
        return done(null,users[0]);

    }).catch(err => {
        console.log(err);
    })
    // pool.query("SELECT * FROM user_table WHERE id = $1",[id],(err,result)=>{
    //     if(err){
    //         throw err;
    //     }
        console.log("Passport deserial");
        
    })





//SERIALISE AND DESERIALIZE

// passport.serializeUser((user,done)=>{
//     done(null,user.id);
//     console.log(user);
// })

// passport.deserializeUser((user,done)=>{
//     done(null,user);
// })

// passport.deserializeUser((id,done)=>{
//     pool.query("SELECT * FROM user_table WHERE id = $1",[id],(err,result)=>{
//         if(err){
//             throw err;
//         }
//         return done(null,result.rows[0]);
//     })
// })

// passport.deserializeUser((user,done)=>{
//     pool.query("SELECT * FROM oauth_table WHERE id = $1",[user.id],(err,result)=>{
//         if(err){
//             throw err;
//         }
//         return done(null,result.rows[0]);
//     })
// })

module.exports = initialize;