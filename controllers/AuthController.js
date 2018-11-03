'use strict';
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");

var authController = {};

// Restrict access to root page
authController.home = function (req, res) {
  res.render('principal', {
    user: req.user,
    title: 'QuathFiles'
  });
};

// Go to registration page
authController.register = function (req, res) {
  res.render('auth/register');
};

// Post registration
authController.doRegister = function (req, res) {
  User.register(new User({
    username: req.body.username,
    name: req.body.name
  }), req.body.password, function (err, user) {
    if (err) {
      console.log('Error de registro');
      return res.render('auth/register', {
        user: user
      });
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
};

// Go to login page
authController.login = function (req, res) {
  res.render('auth/login');
};

// Post login
authController.doLogin = function (req, res) {
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
    message: req.flash('Lol esta malo')
  })(req, res, function () {
    res.redirect('/');
  });
};

// logout
authController.logout = function (req, res) {
  req.logout();
  res.clearCookie('sessionid', {path: '/'});
  res.redirect('/');
};

module.exports = authController;