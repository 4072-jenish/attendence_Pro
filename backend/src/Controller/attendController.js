const Attendance = require('../Model/attendModel');
const { calculateWorkTime } = require('../Utils/calculateWorling');
const { formatTime } = require('../Utils/timFormater');

const punchIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const existing = await Attendance.findOne({
      userId: req.user.id,
      date: today
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already punched in today"
      });
    }

    const attendance = await Attendance.create({
      userId: req.user.id,
      date: today,
      punchIn: new Date() 
    });

    const formattedPunchIn = formatTime(attendance.punchIn);

    res.status(201).json({
      message: "Punched in successfully",
      punchIn: formattedPunchIn
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const punchOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      userId: req.user.id,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({ message: "Please punch in first" });
    }

    if (attendance.punchOut) {
      return res.status(400).json({ message: "Already punched out" });
    }

    attendance.punchOut = new Date();

    const workData = calculateWorkTime(attendance);

    attendance.totalWorkMinutes = workData.minutes;
    attendance.totalWorkFormatted = workData.formatted;

    await attendance.save();

    res.status(200).json({
      message: "Punch Out Successful",
      punchOut: formatTime(attendance.punchOut),
      totalWork: attendance.totalWorkFormatted
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const freshBreakStart = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      userId: req.user.id,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({ message: "Please punch in first" });
    }

    if (attendance.freshBreakStart && !attendance.freshBreakEnd) {
      return res.status(400).json({ message: "Fresh break already started" });
    }

    attendance.freshBreakStart = new Date();
    attendance.freshBreakEnd = null;

    await attendance.save();

    res.status(200).json({
      message: "Fresh break started",
      freshBreakStart: formatTime(attendance.freshBreakStart)
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const freshBreakEnd = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      userId: req.user.id,
      date: today
    });

    if (!attendance || !attendance.freshBreakStart) {
      return res.status(400).json({ message: "Fresh break not started" });
    }

    if (attendance.freshBreakEnd) {
      return res.status(400).json({ message: "Fresh break already ended" });
    }

    attendance.freshBreakEnd = new Date();

    await attendance.save();

    res.status(200).json({
      message: "Fresh break ended",
      freshBreakEnd: formatTime(attendance.freshBreakEnd)
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTodayAttendance = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      userId: req.user.id,
      date: today
    });

    if (!attendance) {
      return res.status(200).json(null);
    }

    res.status(200).json({
      punchIn: attendance.punchIn 
        ? formatTime(attendance.punchIn)
        : null,

      freshBreakStart: attendance.freshBreakStart 
        ? formatTime(attendance.freshBreakStart)
        : null,

      freshBreakEnd: attendance.freshBreakEnd 
        ? formatTime(attendance.freshBreakEnd)
        : null,

      punchOut: attendance.punchOut 
        ? formatTime(attendance.punchOut)
        : null,

      totalWork: attendance.totalWorkFormatted || null
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
    punchIn,
    punchOut,
    freshBreakStart,
    freshBreakEnd,
    getTodayAttendance
}