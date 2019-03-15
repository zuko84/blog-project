const express = require('express');
const _ = require('lodash');
const passport = require('passport');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const app = express();

const User = require('../models/User');

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    
    if(!username || !email || !password) {
     req.flash('error', 'Please Fill All the Requirement');
    }
    
    if(password.length < 3) {
     req.flash('warn', 'Password should be at least 3 characters' );
    }
    
    User.findOne({
        username: username
        }).then((user) => {
        if(user) {
         req.flash('warn', 'User Existed');
         res.redirect('/register');
        } else {
         const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
         });
         
         bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) {
             console.log(err);   
            }
            
            newUser.password = hash;
            
            newUser.save().then((user) => {
                req.flash('success', 'Successfully Registered ' + user.username);
                res.redirect('/blogs');
            }).catch((e) => {
             console.log(e);    
             req.flash('error', e.message);
             res.redirect('/register');
            });            
          });
         });        
        }        
    }).catch((e) => {
       console.log(e); 
    });    
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res, next) => {
        passport.authenticate('local', {
        successRedirect: '/blogs',
        failureRedirect: '/login',
        failureFlash : true,
        successFlash: true
    })(req, res, next)
});

app.get('/logout', (req, res) => {
    req.flash('success', 'Successfully Logged Out');
    req.logout();
    res.redirect('/blogs');
});

module.exports = app;