const express = require('express');
const authRouter = require('./authRouter');
const attendRouter = require('./attendRouter');

const indexRouter = express.Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/attend', attendRouter);


module.exports = indexRouter;