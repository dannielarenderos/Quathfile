'use strict';
var express = require('express');
var router = express.Router();
var userController = require("../controllers/UserController");
var passport = require('passport');
var walk = require('walk'); //Para obtener todos los archivos del folder del usuario

/* GET users listing. */
router.get('/profile',userController.profile);

router.get('/profile/todosLosArchivos',userController.profileAllFiles);

router.get('/misArchivos', userController.misArchivos);

router.post('/misArchivos', userController.descargarArchivo);

router.get('/profile/mostrarTodosLosArchivos', userController.getAllFiles);

module.exports = router;
