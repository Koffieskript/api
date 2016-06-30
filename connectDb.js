const mongoose = require('mongoose');
const bluebird = require('bluebird');
const uri = require('./utilities').MONGO;
console.log(uri);
mongoose.Promise = bluebird;

module.exports = function connectDb () {
  mongoose.connect(uri);
  mongoose.connection.on('connected', () => {
    console.log('Connected to the database');
  });

  mongoose.connection.on('error', (error) => {
    console.log(`Error connecting to the database: ${error}`);
  });
}
