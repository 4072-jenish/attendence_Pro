const express = require('express');
const { loginUser, registerUser } = require('../Controller/authController');

const authRouter = express.Router();

authRouter.post('/regUser', registerUser);
authRouter.use('/login', loginUser);


module.exports = authRouter;