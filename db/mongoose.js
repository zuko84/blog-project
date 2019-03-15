const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://zuko84:${process.env.password}@cluster0-yq0wg.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true });

module.exports = {mongoose};

