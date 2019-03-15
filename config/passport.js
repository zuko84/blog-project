const localStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new localStrategy((username, password, done) => {
            User.findOne({username: username}).then((user) => {
                if(!user) {
                    return done(null, false, {message: 'Wrong Input ID'});
                }                

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) {
                        throw err;
                    }

                    if(isMatch) {
                        return done(null, user, {message: 'Welcome To The BlogApp'});
                    } else {
                        return done(null, false, {message: 'Wrong Password'});
                    }
                });
            }).catch((e) => {
                console.log(e);                
            })
        })
    )

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
};