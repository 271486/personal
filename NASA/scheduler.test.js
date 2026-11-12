"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const scheduler = require("./scheduler");

function formValues(overrides = {}) {
  return {
    currentBedtime: "22:00",
    targetBedtime: "02:00",
    direction: "later",
    sleepDuration: "8",
    currentMissionDay: 1,
    operationDay: 6,
    operationStart: "",
    operationEnd: "",
    operations: [],
    lightCycleStart: null,
    lightCycleLength: 14,
    caffeineInstruction: "",
    sleepAidInstruction: "",
    ...overrides
  };
}

test("limits each generated sleep-onset adjustment to one hour", () => {
  const plan = scheduler.makePlan(formValues(), 3, []);
  assert.equal(scheduler.MAX_DAILY_SHIFT_MINUTES, 60);
  assert.equal(plan.recommendedBedtime, "23:00");
  assert.equal(plan.shiftHours, 1);
  assert.equal(plan.remainingPeriods, 4);
  assert.equal(plan.schedule[1].bedtime, "23:00");
});

test("limits an earlier shift to one hour as well", () => {
  const plan = scheduler.makePlan(formValues({
    currentBedtime: "06:00",
    targetBedtime: "02:00",
    direction: "earlier"
  }), 3, []);
  assert.equal(plan.recommendedBedtime, "05:00");
  assert.equal(plan.shiftHours, 1);
});

test("handles earlier shifts and midnight wrap", () => {
  const plan = scheduler.makePlan(formValues({
    currentBedtime: "00:30",
    targetBedtime: "22:30",
    direction: "earlier",
    currentMissionDay: 2,
    operationDay: 3
  }), 3, []);
  assert.equal(plan.recommendedBedtime, "23:30");
  assert.equal(plan.windDown, "21:30");
  assert.equal(plan.wakeTime, "07:30");
});

test("personalizes sleep opportunity after three feedback entries", () => {
  const feedback = [
    { actualSleep: 6 },
    { actualSleep: 7 },
    { actualSleep: 7 }
  ];
  const plan = scheduler.makePlan(formValues(), 4, feedback);
  assert.equal(plan.sleepHours, 7.5);
  assert.equal(plan.schedule[0].wake, "05:30");
  assert.equal(plan.sleepDebt, 4);
});

test("feedback advances the mission day and uses actual sleep onset", () => {
  const previous = scheduler.makePlan(formValues({ currentMissionDay: 2, operationDay: 7 }), 3, []);
  const feedback = [{ actualSleep: 7, alertness: 2, actualBedtime: "23:15" }];
  const refreshed = scheduler.refreshPlanFromFeedback(previous, feedback);
  assert.equal(refreshed.formValues.currentMissionDay, 3);
  assert.equal(refreshed.formValues.currentBedtime, "23:15");
  assert.equal(refreshed.recommendedBedtime, "00:15");
  assert.equal(refreshed.formValues.operationDay, 7);
});

test("feedback uses planned sleep onset when actual onset is omitted", () => {
  const previous = scheduler.makePlan(formValues({ currentMissionDay: 2, operationDay: 7 }), 3, []);
  const feedback = [{ actualSleep: 8, alertness: 4, actualBedtime: "" }];
  const refreshed = scheduler.refreshPlanFromFeedback(previous, feedback);
  assert.equal(refreshed.formValues.currentMissionDay, 3);
  assert.equal(refreshed.formValues.currentBedtime, previous.recommendedBedtime);
});

test("flags operation overlap including overnight intervals", () => {
  assert.equal(scheduler.overlapsOperation(22 * 60, 30 * 60, "23:00", "01:00"), true);
  assert.equal(scheduler.overlapsOperation(22 * 60, 30 * 60, "07:00", "09:00"), false);
});

test("rejects malformed operation rows instead of silently dropping them", () => {
  assert.throws(
    () => scheduler.parseOperations("10,06:00,12:00; docking", "", "", 1),
    /Operation line 1/
  );
  assert.deepEqual(
    scheduler.parseOperations("10,06:00,12:00,Docking", "", "", 1),
    [{ day: 10, start: "06:00", end: "12:00", label: "Docking" }]
  );
});
