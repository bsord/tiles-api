const os = require('os');
const express = require("express");
const router = express.Router();
var passport = require('passport');

const Tile = require('../controllers/tile');
var Auth = require('../controllers/auth');

router.get("/", (req,res) => {
  var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : "Unknown");
  res.send({ response: {msg:"I am alive", host: os.hostname(), clientSourceIP: ip}}).status(200);
});
router.get("/healthz", (req,res) => {
  var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : "Unknown");
  res.send({ response: {msg:"I am alive", host: os.hostname(), clientSourceIP: ip}}).status(200);
});

router.get("/tiles", Tile.list)
router.get("/tiles/:boardId", Tile.get)
router.get("/tiles/:boardId/log", Tile.log)
router.post("/tiles", Tile.post)

router.post('/auth/register', Auth.registerLocal); //Register user via email/username/pass
router.post('/auth/login', Auth.loginLocal); //Authenticate User/Pass
router.post('/auth/google', passport.authenticate('google-token', { session: false}), Auth.loginGoogle); //Authenticate Google Token/oAuth2
router.post('/auth/github', passport.authenticate('github-token', { session: false}), Auth.loginGithub); //Authenticate Github Token/oAuth2
router.post('/auth/github/get-token', Auth.getGithubToken); //Authenticate Github Token/oAuth2

module.exports = router;
