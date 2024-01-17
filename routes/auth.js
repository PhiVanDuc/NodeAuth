const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get('/', authMiddleware, authController.index);

router.get('/login', authMiddleware, authController.login);
router.post('/login', authController.handleLogin);

router.get('/registor', authMiddleware, authController.registor);
router.post('/registor', authController.handleRegistor);

module.exports = router;