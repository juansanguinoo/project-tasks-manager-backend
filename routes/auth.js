const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController.js');
const auth = require('../middleware/auth.js');

router.post('/', authController.authUser);

router.get('/', auth, authController.authenticatedUser);

module.exports = router;
