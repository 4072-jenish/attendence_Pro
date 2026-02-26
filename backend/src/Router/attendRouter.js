const express = require('express');
const { punchIn, punchOut, freshBreakStart, freshBreakEnd, getTodayAttendance } = require('../Controller/attendController');
const protect = require('../Middleware/authMiddleware');
const attendRouter = express.Router();


attendRouter.get('/punchIn', protect ,punchIn);
attendRouter.get('/punchOut', protect ,punchOut);
attendRouter.get('/freshBreakStart', protect ,freshBreakStart);
attendRouter.get('/freshBreakEnd', protect ,freshBreakEnd);
attendRouter.get('/today', protect ,getTodayAttendance);

module.exports = attendRouter;