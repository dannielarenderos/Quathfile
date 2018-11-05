'use strict';
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");
var fs = require("fs");
var upload = require("express-fileupload");

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(upload());
var expressValidator = require('express-validator');

var nodemailer= require('nodemailer');

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
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var passwordConfirmar = req.body.passwordConfirmar;
  /*
    req.checkBody('username', 'Userame no puede ser vacio').notEmpty();
    req.checkBody('email', 'Email no puede ser vacio').isEmail();
    req.checkBody('passwordConfirmar', 'Las contraseñas deben coincidir').equals(password);
  */
  User.register(new User({
    username: username,
    email: email
  }), password, function (err, user) {
    if (err) {
      //console.log('Error de registro(pass)');
      return res.render('auth/register', {
        user: user
      });
    } else {

      passport.authenticate('local')(req, res, function () {
        fs.mkdirSync('../public/cloudQF/' + username);
        res.redirect('/');
      });
    }
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
  res.clearCookie('sessionid', { path: '/' });
  res.redirect('/');
};

authController.Upload = function (req, res) {
  res.render('subir');
};

authController.doUpload = function (req, res) {

  if (req.files) {
    console.log(req.files);
    var file = req.files.archivo;
    var nombreArchivo = file.name;
    file.mv("../public/cloudQF/" + req.user.username + "/" + nombreArchivo, function (err) {
      if (err) {
        res.send('error ocurred');
        throw err;
      }
      console.log('Subido con exito');
    })
  }
  res.render('principal',
    {
      message: 'Archivo subido con exito',
      user: req.user,
      title: 'QuathFiles'
    });
};

authController.Contact = function(req,res){
  res.render('contact');
}

authController.DoContact = function(req,res){
    const msj=`
    <p>Nueva consulta</p> 
    <h2>Informacion de contacto</h2> 
    <ul> 
      <li>Usuario : ${req.user.username}</li>
      <li>Correo : ${req.user.email}</li>
    </ul>
    <h3>Mensaje: ${req.body.consulta}</h3>
    `;
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false, // true para 465, false cualquier otro
      port: 587,
      auth: {
          user: 'noReplyQuathFiles@gmail.com',
          clientId: '1065612072443-g2d6egj0l6kd1ulj5g56rhn0r3nggm5g.apps.googleusercontent.com',
          clientSecret: 'mBzpuLr__xocWKRK1fxm4vvb',
          pass: 'Quath69Files420'
      },
      tls:{
          rejectUnauthorized: false
      }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"'+req.user.username+'" <noReplyQuathFiles@gmail.com>',
      to: 'noReplyQuathFiles@gmail.com',
      subject: 'Consulta QhathFiles',
      text: req.body.consulta,
      html: msj
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent'+info);
  });
  res.render('principal',
    {
      message: 'Mensaje enviado con exito, gracias por su apoyo :D',
      user: req.user,
      title: 'QuathFiles'
    });
}

module.exports = authController;