const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
      },
      async function(accessToken, refreshToken, profile, cb) {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image:profile.photos[0].value
        }
        try{
            let user = await User.find({ googleId: profile.id });
            
            if(user){
                console.log("User Exist");
                return cb(null, user);
            }else{
                console.log("User Doesn't exist .. Creating");
                user = await User.create(newUser);
                return cb(null, user);
            }
        }catch(error){
            console.error(error);
        }
      }
    ));
    passport.serializeUser((user,done)=>{
        done(null,user)
    });
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user)
        })
    });
}
