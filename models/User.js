const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 username: {
  type: String,
  required: true
 },
 email: {
  type:String,
  required: true
 },
 password: {
  type: String,
  minlength: 3
 }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
