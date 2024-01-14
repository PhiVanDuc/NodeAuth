const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get('/', authController.index);

router.get('/login', authController.login);
router.post('/login', authController.handleLogin);

router.get('/registor', authController.registor);
router.post('/registor', authController.handleRegistor);

module.exports = router;