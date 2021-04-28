var settings = require('../config/settings');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var request = require('request');


// Create a new user
exports.registerLocal = (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.name) {
    res.json({ success: false, msg: 'Please pass name, username,  and password.' });
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
      emailVerified: false,
    });
    // save the user
    newUser.save(function (err, user) {
      if (err) {
        return res.json({ success: false, msg: 'Username already exists.' });
      }
      var token = jwt.sign(user.toJSON(), settings.secret);
      res.json({ success: true, token: 'JWT ' + token, username: user.username, name: user.name, admin: user.admin, id: user._id });

    })

  }
};

// Login via username and password to get auth token.
exports.loginLocal = (req, res) => {
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).send({ success: false, msg: 'Authentication failed' }); //user not found
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), settings.secret);
          // return the information including token as JSON
          res.json({ success: true, token: 'JWT ' + token, username: user.username, name: user.name, admin: user.admin, id: user._id });
        } else {
          res.status(401).send({ success: false, msg: 'Authentication failed.' }); //wrong password
        }
      });
    }
  });
}

exports.loginGoogle = (req, res) => {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
  User.findOne({
    _id: req.user.id
  }, function (err, user) {
    // if user is found and password is right create a token
    var token = jwt.sign(user.toJSON(), settings.secret);

    res.json({ success: true, token: 'JWT ' + token, username: user.username, name: user.name, admin: user.admin, id: user._id});

  });
}

exports.loginGithub = (req, res) => {
  if (!req.user) {
    return res.send(401, 'User Not Authenticated');
  }
  User.findOne({
    _id: req.user.id
  }, function (err, user) {
    // if user is found and password is right create a token
    var token = jwt.sign(user.toJSON(), settings.secret);

    res.json({ success: true, token: 'JWT ' + token, username: user.username, name: user.name, admin: user.admin, id: user._id});

  });
}

exports.getGithubToken = (req, res) => {
  var clientServerOptions = {
    uri: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT}&client_secret=${process.env.GITHUB_SECRET}&code=${req.body.code}`,
    body: "",
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
  request(clientServerOptions, function (error, response) {
    res.json({ access_token: JSON.parse(response.body).access_token })
  });


}