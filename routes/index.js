const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const NodeGeocoder = require('node-geocoder');
const app = express();

const Blog = require('../models/Blog');
const User = require('../models/User');
const Comment = require('../models/Comment');

const {isLoggedIn, ownerShip} = require('../config/auth');

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
const geocoder = NodeGeocoder(options);

app.get('/', (req, res) => {
   res.render('landing');
});

app.get('/privacy', (req, res) => {
   res.render('privacy');
});

app.get('/term', (req, res) => {
   res.render('term');
});

app.get('/blogs', (req, res) => {
   Blog.find({}).then((foundBlog) => {
     res.render('blog/index', {blog: foundBlog}); 
   }).catch((e) => {
      console.log(e);
   });
});

app.post('/blogs', (req, res) => {
   // const body = _.pick(req.body.blog, ['name', 'detail', 'image1', 'image2', 'paragraph1', 'paragraph2', 'author']);
   
   const name = req.body.blog.name;
   const detail = req.body.blog.detail;
   const image1 = req.body.blog.image1;
   const image2 = req.body.blog.image2;
   const paragraph1 = req.body.blog.paragraph1;
   const paragraph2 = req.body.blog.paragraph2;
   const author = {
    id: req.user._id,
    username: req.user.username,
    email: req.user.email
    };
    
    geocoder.geocode(req.body.blog.location, (err, data) => {
       if(err || !data.length) {
          console.log(err);
        req.flash('error', 'Invalid Address');
        return res.redirect('back');
       }
       
       const lat = data[0].latitude;
       const lng = data[0].longitude;
       const location = data[0].formattedAddress;
       const newBlog = new Blog({
       name,
       detail,
       image1,
       image2,
       paragraph1,
       paragraph2,
       author,
       location,
       lat,
       lng
      });
      
      Blog.create(newBlog).then((blog) => {
      // blog.author.id = req.user._id;
      // blog.author.username = req.user.username;
      // blog.author.email = req.user.email;
      res.redirect('/blogs');
   }).catch((e) => {
      console.log(e);
   });
       
  });

});

app.get('/blogs/news', isLoggedIn, (req, res) => {
   res.render('blog/new');
});

app.get('/blogs/:id', (req, res) => {
   Blog.findById(req.params.id).populate('comments').exec(function(err, foundBlog) {
      if(err || !foundBlog) {
      req.flash('error', 'Blog Not Found');
      res.redirect('/blogs');
      }
      
      res.render('blog/show', {blog: foundBlog});
   })
});

app.get('/blogs/:id/comments/new', (req, res) => {
   Blog.findById(req.params.id).then((blog) => {
     res.render('comment/new', {blog: blog});
   }).catch((e) => {
       req.flash('error', 'Blog Not Found');
       res.redirect('/blogs');
   });

});

app.post('/blogs/:id/comments', (req, res) => {
   Blog.findById(req.params.id).then((blog) => {
      Comment.create(req.body.comment).then((comment) => {
         blog.comments.push(comment);
         blog.save();
         res.redirect('/blogs/' + blog._id);
      }).catch((e) => {
         console.log(e);
      });
   }).catch((e) => {
      req.flash('error', 'Blog Not Found');
      res.redirect('/blogs');
   });
});

app.get('/blogs/:id/edit', ownerShip, (req, res) => {
   Blog.findById(req.params.id).then((blog) => {
    res.render('blog/edit', {blog: blog});  
   }).catch((e) => {
       req.flash('error', 'Blog Not Found');
       res.redirect('/blogs');
   });
});

app.put('/blogs/:id', (req, res) => {
   geocoder.geocode(req.body.blog.location, (err, data) => {
      if(err || !data.length) {
       req.flash('error', 'Invalid Address');
       return res.redirect('back');
      }
      
      req.body.blog.lat = data[0].latitude;
      req.body.lng = data[0].longitude;
      req.body.location = data[0].formattedAddress;
      
      Blog.findByIdAndUpdate(req.params.id, req.body.blog).then((blog) => {
        res.redirect('/blogs/' + blog._id);
      }).catch((e) => {
        req.flash('error', 'Blog Not Found');
        res.redirect('/blogs');
     });
   
   });
   
});

app.delete('/blogs/:id', ownerShip, (req, res) => {
   Blog.findOneAndDelete(req.params.id).then((blog) => {
      res.redirect('/blogs');
   }).catch((e) => {
       req.flash('error', 'Blog Not Found');
       res.redirect('/blogs');
   });
});



module.exports = app;