const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    date: {
      type: String,
      required: true
    },

    punchIn: {
      type: Date
    },

    freshBreakStart: {
      type: Date
    },

    freshBreakEnd: {
      type: Date
    },

    lunchStart: {
      type: Date
    },

    lunchEnd: {
      type: Date
    },

    punchOut: {
      type: Date
    },

    totalWorkMinutes: {
      type: Number,
      default: 0
    },

    totalWorkFormatted: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);