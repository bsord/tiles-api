// import dependencies
const mongoose = require('mongoose');

const Tile = require('./tile');

const connectDb = () => {
  mongoose.connect(process.env.MongoURI, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }).
  catch(error => console.log(error)); // Use new url parser to supress warnings

  mongoose.set('useCreateIndex', true); // Hide warnings about deprecation of 'ensureIndex'
  mongoose.Promise = global.Promise;
  mongoose.connection.on('error', error => {
    console.log(error);
  });
  return mongoose;
};

const models = { Tile };

module.exports = {connectDb, models};