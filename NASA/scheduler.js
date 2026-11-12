"use strict";

(function exposeScheduler(root, factory) {
  const scheduler = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = scheduler;
  else root.SleepShiftScheduler = scheduler;
})(globalThis, () => {
  const MAX_DAILY_SHIFT_MINUTES = 60;

  function timeToMinutes(value) {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function formatTime(totalMinutes) {
    const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
    const hours = Math.floor(wrapped / 60);
    const minutes = wrapped % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  function minutesUntilTarget(current, target, direction) {
    if (current === target) return 0;
    return direction === "earlier"
      ? (current - target + 1440) % 1440
      : (target - current + 1440) % 1440;
  }

  function overlapsOperation(sleepStart, sleepEnd, operationStart, operationEnd) {
    if (!operationStart || !operationEnd) return false;
    const operationStartMinutes = timeToMinutes(operationStart);
    let operationEndMinutes = timeToMinutes(operationEnd);
    if (operationEndMinutes <= operationStartMinutes) operationEndMinutes += 1440;

    for (const offset of [-1440, 0, 1440, 2880]) {
      const start = operationStartMinutes + offset;
      const end = operationEndMinutes + offset;
      if (sleepStart < end && start < sleepEnd) return true;
    }
    return false;
  }

  function calculateFatigueScore(sleepHours, shiftHours, latestAlertness, sleepDebt = 0, operationCount = 0) {
    const sleepBurden = Math.max(0, 8 - sleepHours) * 12;
    const shiftBurden = Math.min(20, shiftHours * 10);
    const alertnessBurden = (5 - latestAlertness) * 5;
    const debtBurden = Math.min(25, Math.max(0, sleepDebt) * 4);
    const operationBurden = Math.min(15, operationCount * 3);
    return Math.max(0, Math.min(100, Math.round(sleepBurden + shiftBurden + alertnessBurden + debtBurden + operationBurden)));
  }

  function parseOperations(value, legacyStart, legacyEnd, currentDay) {
    const lines = String(value || "").split("\n");
    const operations = [];
    for (const [index, rawLine] of lines.entries()) {
      const line = rawLine.trim();
      if (!line) continue;
      const [day, start, end, ...labelParts] = line.split(",").map((part) => part.trim());
      const validDay = /^\d{1,3}$/.test(day) && Number(day) >= 1 && Number(day) <= 365;
      const validTime = (time) => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time || "");
      if (!validDay || !validTime(start) || !validTime(end)) {
        throw new Error(`Operation line ${index + 1} must be: mission day, HH:MM start, HH:MM end, label.`);
      }
      operations.push({ day: Number(day), start, end, label: labelParts.join(",") || "Operation" });
    }
    if (!operations.length && legacyStart && legacyEnd) {
      operations.push({ day: currentDay, start: legacyStart, end: legacyEnd, label: "Required operation" });
    }
    return operations;
  }

  function lunarContext(day, start, length) {
    if (!start || !length) return "Lunar light cycle not specified; follow the habitat lighting plan.";
    const phase = (day - start + 28) % 28;
    return phase < length
      ? "Lunar light phase: use mission-approved bright-light timing and protect wind-down light reduction."
      : "Lunar dark phase: use mission-approved light exposure to anchor the schedule.";
  }

  function getPersonalizedSleepNeed(feedback, requested) {
    const actual = feedback.map((entry) => Number(entry.actualSleep)).filter(Number.isFinite);
    if (actual.length < 3) return requested;
    const average = actual.reduce((sum, value) => sum + value, 0) / actual.length;
    return Math.max(5, Math.min(10, Math.round(((requested + average) / 2) * 2) / 2));
  }

  function makePlan(formValues, latestAlertness = 3, feedback = []) {
    const currentBedtime = timeToMinutes(formValues.currentBedtime);
    const targetBedtime = timeToMinutes(formValues.targetBedtime);
    const distance = minutesUntilTarget(currentBedtime, targetBedtime, formValues.direction);
    const shiftMinutes = Math.min(distance, MAX_DAILY_SHIFT_MINUTES);
    const directionSign = formValues.direction === "earlier" ? -1 : 1;
    const recommendedBedtime = currentBedtime + shiftMinutes * directionSign;
    const sleepHours = getPersonalizedSleepNeed(feedback, Number(formValues.sleepDuration));
    const wakeTime = recommendedBedtime + sleepHours * 60;
    const remainingPeriods = Math.ceil(distance / MAX_DAILY_SHIFT_MINUTES);
    const daysToOperation = formValues.operationDay - formValues.currentMissionDay;
    const scheduleRisk = distance > Math.max(0, daysToOperation) * MAX_DAILY_SHIFT_MINUTES;
    const sleepDebt = feedback.slice(-7).reduce((sum, entry) => sum + Math.max(0, 8 - Number(entry.actualSleep)), 0);
    const schedule = [];
    for (let day = formValues.currentMissionDay; day <= formValues.operationDay; day += 1) {
      const elapsed = day - formValues.currentMissionDay;
      const dailyShift = Math.min(distance, elapsed * MAX_DAILY_SHIFT_MINUTES);
      const bedtime = currentBedtime + dailyShift * directionSign;
      const operations = formValues.operations.filter((operation) => operation.day === day);
      schedule.push({
        day,
        bedtime: formatTime(bedtime),
        wake: formatTime(bedtime + sleepHours * 60),
        operations,
        lunar: lunarContext(day, formValues.lightCycleStart, formValues.lightCycleLength)
      });
    }
    const conflict = formValues.operations
      .filter((operation) => operation.day === formValues.currentMissionDay)
      .some((operation) => overlapsOperation(
        recommendedBedtime,
        wakeTime,
        operation.start,
        operation.end
      ));
    return {
      formValues,
      recommendedBedtime: formatTime(recommendedBedtime),
      windDown: formatTime(recommendedBedtime - 120),
      wakeTime: formatTime(wakeTime),
      sleepHours,
      shiftHours: shiftMinutes / 60,
      remainingPeriods,
      daysToOperation,
      scheduleRisk,
      sleepDebt,
      schedule,
      conflict,
      score: calculateFatigueScore(sleepHours, shiftMinutes / 60, latestAlertness, sleepDebt, formValues.operations.length),
      generatedAt: new Date().toISOString()
    };
  }

  function refreshPlanFromFeedback(plan, feedback) {
    if (!plan?.formValues || !feedback.length) return null;
    const formValues = { ...plan.formValues };
    if (formValues.operations === undefined) formValues.operations = [];
    if (formValues.operationStart === undefined) formValues.operationStart = "";
    if (formValues.operationEnd === undefined) formValues.operationEnd = "";
    const previousMissionDay = Number(formValues.currentMissionDay) || 1;
    const finalMissionDay = Number(formValues.operationDay) || previousMissionDay;
    const latestFeedback = feedback[feedback.length - 1];
    formValues.currentBedtime = latestFeedback.actualBedtime || plan.recommendedBedtime || formValues.currentBedtime;
    formValues.currentMissionDay = Math.min(finalMissionDay, previousMissionDay + 1);
    return makePlan(formValues, Number(latestFeedback.alertness) || 3, feedback);
  }

  return {
    MAX_DAILY_SHIFT_MINUTES,
    calculateFatigueScore,
    formatTime,
    makePlan,
    overlapsOperation,
    parseOperations,
    refreshPlanFromFeedback,
    timeToMinutes
  };
});
