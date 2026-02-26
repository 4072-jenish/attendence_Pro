const express = require('express');
const { loginUser, registerUser } = require('../Controller/authController');

const authRouter = express.Router();

authRouter.post('/regUser', registerUser);
authRouter.post('/login', loginUser);


module.exports = authRouter;
