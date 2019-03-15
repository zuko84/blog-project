const Blog = require('../models/Blog');
const mongoose = require('mongoose');

module.exports = { 
    isLoggedIn: function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please Log In');
    res.redirect('/login');
 },
 ownerShip: function(req, res, next) {
    if(req.isAuthenticated()) { 
    Blog.findById(req.params.id).then((blog) => {
         if(blog.author.id.equals(req.user._id)) { 
            next();
         } else {
         req.flash('error', 'Access Denied');
         res.redirect('back');
         }

    }).catch((e) => {
         req.flash('error', 'Blog Not Found');
         res.redirect('back');
    })
    } else {
    req.flash('error', 'Please Log In');
       res.redirect('back');
    }
 }
};



