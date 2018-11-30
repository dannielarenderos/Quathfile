'use strict';
var express = require('express');
var router = express.Router();
var auth = require("../controllers/AuthController.js");



// restrict index for logged in user only
router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

//router para subir
router.get('/subir', auth.Upload);
//router para hacer subida
router.post('/subir', auth.doUpload);

//router para comentarios
router.get('/contact', auth.Contact);
//router para enviar comentarios
router.post('/contact', auth.DoContact);

router.get('/kaka', auth.prueba);




module.exports = router;