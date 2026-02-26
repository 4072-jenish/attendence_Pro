exports.calculateWorkTime = (attendance) => {

  if (!attendance.punchIn || !attendance.punchOut) {
    return { minutes: 0, formatted: "0h 0m" };
  }

  let totalMinutes =
    (attendance.punchOut - attendance.punchIn) / (1000 * 60);

  if (attendance.freshBreakStart && attendance.freshBreakEnd) {
    totalMinutes -=
      (attendance.freshBreakEnd - attendance.freshBreakStart) /
      (1000 * 60);
  }

  if (attendance.lunchStart && attendance.lunchEnd) {
    totalMinutes -=
      (attendance.lunchEnd - attendance.lunchStart) /
      (1000 * 60);
  }

  totalMinutes = Math.max(0, totalMinutes);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  return {
    minutes: totalMinutes,
    formatted: `${hours}h ${minutes}m`
  };
};