// Load environment Variables (must be specified in .env file on root)
require('dotenv').config()

if(!process.env.TOKEN_SECRET){ console.warn("TOKEN_SECRET not passed. Using a default value."); }
const	secret = process.env.TOKEN_SECRET || "MyTokenSecret";

module.exports = {
  'secret': secret
};