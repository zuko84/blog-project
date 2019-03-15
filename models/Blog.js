const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
   name: String,
   image1: String,
   image2: String,
   detail: String,
   location: String,
   lat: Number,
   lng: Number,
   createdAt: {type: Date, default: Date.now},
   paragraph1: String,
   paragraph2: String,
   comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
       }],
   author: {
      id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
       },
      username: String,
      email: String
    }
});


const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;