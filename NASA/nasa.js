(() => {
  "use strict";

  const ACCOUNTS_KEY = "ssrs.accounts.v1";
  const SESSION_KEY = "ssrs.activeCrew";
  const ITERATIONS = 210000;
  const MAX_DAILY_SHIFT_MINUTES = 120;
  const CREW_COLORS = ["#83d9c1", "#8fb8ff", "#d9a7ff", "#ffb36b", "#ff8f9c", "#b9d66f"];
  const $ = (selector) => document.querySelector(selector);

  const authScreen = $("#auth-screen");
  const plannerScreen = $("#planner-screen");
  const authForm = $("#auth-form");
  const authMessage = $("#auth-message");
  const planForm = $("#plan-form");
  const planMessage = $("#plan-message");
  const planOutput = $("#plan-output");
  const feedbackMessage = $("#feedback-message");
  const copyConstraintsButton = $("#copy-constraints");
  const missionCalendar = $("#mission-calendar");
  const missionCalendarGrid = $("#mission-calendar-grid");

  let authMode = "login";
  let activeCrewId = null;
  let currentPlan = null;

  function setMessage(element, message, success = false) {
    element.textContent = message;
    element.classList.toggle("success", success);
  }

  function getAccounts() {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];

    const accounts = JSON.parse(raw);
    if (!Array.isArray(accounts) || accounts.some((account) =>
      !account || typeof account.id !== "string" ||
      typeof account.name !== "string" ||
      typeof account.salt !== "string" ||
      typeof account.passwordHash !== "string"
    )) {
      throw new Error("Saved account data is invalid. Clear this prototype's browser data and create a new local account.");
    }
    return accounts;
  }

  function getCrewData(crewId) {
    const raw = localStorage.getItem(`ssrs.crew.${crewId}`);
    if (!raw) return { plan: null, feedback: [] };

    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || !Array.isArray(data.feedback)) {
      throw new Error("Saved crew data is invalid. Clear this prototype's browser data and sign in again.");
    }
    return {
      plan: data.plan && typeof data.plan === "object" ? data.plan : null,
      feedback: data.feedback
    };
  }

  function saveCrewData(crewId, data) {
    localStorage.setItem(`ssrs.crew.${crewId}`, JSON.stringify(data));
  }

  function encodeBytes(bytes) {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function decodeHex(value) {
    if (value.length % 2 !== 0 || !/^[a-f0-9]*$/i.test(value)) {
      throw new Error("Saved password data is invalid.");
    }
    return Uint8Array.from(value.match(/.{2}/g) || [], (pair) => Number.parseInt(pair, 16));
  }

  async function hashPassword(password, salt) {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const result = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
      key,
      256
    );
    return encodeBytes(new Uint8Array(result));
  }

  function equalHashes(left, right) {
    if (left.length !== right.length) return false;
    let difference = 0;
    for (let index = 0; index < left.length; index += 1) {
      difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }
    return difference === 0;
  }

  function setAuthMode(mode) {
    authMode = mode;
    const creating = mode === "create";
    $("#login-tab").classList.toggle("active", !creating);
    $("#create-tab").classList.toggle("active", creating);
    $("#login-tab").setAttribute("aria-selected", String(!creating));
    $("#create-tab").setAttribute("aria-selected", String(creating));
    $("#name-field").classList.toggle("hidden", !creating);
    $("#role-field").classList.toggle("hidden", !creating);
    $("#confirm-field").classList.toggle("hidden", !creating);
    $("#auth-heading").textContent = creating ? "Create crew account" : "Crew sign in";
    $("#auth-description").textContent = creating
      ? "Create a local account to keep this crew member’s plan and feedback separate."
      : "Sign in to view this crew member’s local plan and feedback.";
    $("#auth-submit").textContent = creating ? "Create account" : "Sign in";
    $("#password").setAttribute("autocomplete", creating ? "new-password" : "current-password");
    setMessage(authMessage, "");
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function getCrewColor(crewId) {
    return CREW_COLORS[Array.from(crewId).reduce((sum, character) => sum + character.charCodeAt(0), 0) % CREW_COLORS.length];
  }

  function getAvailableCrewColor(accounts, crewId) {
    const usedColors = new Set(accounts.map((account) => account.color).filter(Boolean));
    return CREW_COLORS.find((color) => !usedColors.has(color)) || getCrewColor(crewId);
  }

  function showAuth(message = "") {
    plannerScreen.classList.add("hidden");
    authScreen.classList.remove("hidden");
    activeCrewId = null;
    currentPlan = null;
    if (message) setMessage(authMessage, message);
  }

  function showPlanner(crewId) {
    const account = getAccounts().find((candidate) => candidate.id === crewId);
    if (!account) {
      sessionStorage.removeItem(SESSION_KEY);
      showAuth("This local account could not be found. Please sign in again.");
      return;
    }
    activeCrewId = crewId;
    sessionStorage.setItem(SESSION_KEY, crewId);
    authScreen.classList.add("hidden");
    plannerScreen.classList.remove("hidden");
    const crewColor = account.color || getCrewColor(account.id);
    $("#crew-identity").textContent = `${account.name} · ${account.role === "fatigue-specialist" ? "Fatigue specialist" : "Crew member"} · Crew ID ${account.id}`;
    $("#crew-color-indicator").style.backgroundColor = crewColor;
    $("#crew-color-indicator").setAttribute("title", `${account.name} crew color`);
    plannerScreen.style.setProperty("--crew-color", crewColor);
    renderSavedData();
  }

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
    const operations = String(value || "").split("\n").map((line) => {
      const [day, start, end, ...labelParts] = line.split(",").map((part) => part.trim());
      if (!day || !start || !end || !/^\d{1,3}$/.test(day) || !/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) return null;
      return { day: Number(day), start, end, label: labelParts.join(",") || "Operation" };
    }).filter(Boolean);
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

  function getPlanOperations(plan) {
    return Array.isArray(plan.formValues.operations) ? plan.formValues.operations : [];
  }

  function getCountermeasureTimes(plan) {
    const currentDayOperation = getPlanOperations(plan).find(
      (operation) => operation.day === plan.formValues.currentMissionDay
    );
    const operationStart = currentDayOperation?.start || plan.formValues.operationStart;
    if (!operationStart) {
      return {
        nap: "No operation time entered; protect a nap only if operations allow.",
        caffeine: "No operation time entered; follow the approved alertness protocol if needed.",
        sleepAid: plan.formValues.sleepAidInstruction
          ? `At wind-down/sleep onset per the approved instruction: ${plan.formValues.sleepAidInstruction}`
          : "No sleep-aid timing generated; clinician approval is required.",
        operation: "No required awake-operation time entered."
      };
    }

    const operationMinutes = timeToMinutes(operationStart);
    const napEnd = operationMinutes - 180;
    const napStart = napEnd - 90;
    return {
      nap: `Protected 90-minute nap opportunity ${formatTime(napStart)}–${formatTime(napEnd)}, only if operations allow; allow recovery time after waking.`,
      caffeine: `If included in the approved protocol, review caffeine timing 30–60 minutes before the operation (${formatTime(operationMinutes - 60)}–${formatTime(operationMinutes - 30)}); no dose is generated.`,
      sleepAid: plan.formValues.sleepAidInstruction
        ? `At wind-down/sleep onset per the approved instruction: ${plan.formValues.sleepAidInstruction}`
        : "No sleep-aid timing generated; clinician approval is required.",
      operation: `Required awake operation begins at ${operationStart}.`
    };
  }

  function makeOpsConstraints(plan) {
    const countermeasures = getCountermeasureTimes(plan);
    const sleepDebt = Number.isFinite(plan.sleepDebt) ? plan.sleepDebt : 0;
    const operations = getPlanOperations(plan);
    const operationLines = operations.length
      ? operations.map((operation) =>
        `Operation Day ${operation.day}: ${operation.start}–${operation.end} (${operation.label})`
      )
      : [countermeasures.operation];
    return [
      `Sleep onset: ${plan.recommendedBedtime}`,
      `Wake: ${plan.wakeTime}`,
      `Wind-down: ${plan.windDown}`,
      countermeasures.nap,
      countermeasures.caffeine,
      countermeasures.sleepAid,
      "Light: reduce bright/blue-enriched light during wind-down; use mission-approved light timing.",
      "Exercise: avoid vigorous exercise close to sleep; coordinate timing with the fatigue team.",
      ...operationLines,
      "Operations take priority; flight-surgeon/fatigue-specialist instructions override this proposal."
    ].join("\n");
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

  function renderCalendar(plan) {
    if (!plan) {
      missionCalendar.classList.add("hidden");
      missionCalendarGrid.innerHTML = "";
      return;
    }

    const schedule = plan.schedule || [{
      day: plan.formValues.currentMissionDay || "—",
      bedtime: plan.recommendedBedtime,
      wake: plan.wakeTime,
      operations: [],
      lunar: "Legacy saved plan; regenerate to include mission calendar details."
    }];
    const scheduleByDay = new Map(schedule.map((day) => [Number(day.day), day]));
    const lastMissionDay = Math.max(
      28,
      Number(plan.formValues.operationDay) || 0,
      ...schedule.map((day) => Number(day.day) || 0)
    );
    const weekdayMarkup = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      .map((day) => `<div class="calendar-weekday" role="columnheader">${day}</div>`)
      .join("");
    missionCalendar.classList.remove("hidden");
    missionCalendarGrid.innerHTML = `${weekdayMarkup}${Array.from({ length: lastMissionDay }, (_, index) => {
      const missionDay = index + 1;
      const day = scheduleByDay.get(missionDay);
      if (!day) {
        return `<article class="calendar-day calendar-unplanned" role="gridcell" aria-label="Mission Day ${missionDay}">
          <header><strong>Day ${missionDay}</strong></header>
          <p>No sleep-shift plan</p>
        </article>`;
      }
      const operations = day.operations.length
        ? day.operations.map((operation) =>
          `<li><strong>${escapeHTML(operation.label)}</strong><span>${escapeHTML(operation.start)}–${escapeHTML(operation.end)}</span></li>`
        ).join("")
        : "<li class=\"calendar-empty\">No operation scheduled</li>";
      const phaseClass = day.lunar.toLowerCase().includes("light phase") ? " light-phase" : " dark-phase";
      return `
        <article class="calendar-day${phaseClass}" role="gridcell" aria-label="Mission Day ${escapeHTML(day.day)}">
          <header><strong>Day ${escapeHTML(day.day)}</strong><span>${escapeHTML(day.lunar.includes("light phase") ? "Light phase" : "Dark/unspecified")}</span></header>
          <div class="calendar-sleep"><span>Sleep</span><strong>${escapeHTML(day.bedtime)}–${escapeHTML(day.wake)}</strong></div>
          <div class="calendar-operations"><span>Operations</span><ul>${operations}</ul></div>
        </article>
      `;
    }).join("")}`;
  }

  function renderPlan(plan) {
    if (!plan) {
      $("#result-title").textContent = "Your plan will appear here";
      $("#fatigue-score").classList.add("hidden");
      copyConstraintsButton.classList.add("hidden");
      delete copyConstraintsButton.dataset.constraints;
      planOutput.className = "plan-output empty-state";
      planOutput.innerHTML = "<p>Enter the current and target sleep times, then generate a plan.</p>";
      renderCalendar(null);
      return;
    }

    $("#result-title").textContent = "Next sleep period";
    $("#score-value").textContent = String(plan.score);
    $("#fatigue-score").classList.remove("hidden");
    copyConstraintsButton.classList.remove("hidden");
    copyConstraintsButton.dataset.constraints = makeOpsConstraints(plan);
    renderCalendar(plan);
    planOutput.className = "plan-output";

    const shiftSummary = plan.shiftHours === 0
      ? "No sleep-onset shift needed for this period."
      : `Shift ${plan.shiftHours} hour${plan.shiftHours === 1 ? "" : "s"} ${plan.formValues.direction}; allow about 24 hours before the next adjustment.`;
    const periodsSummary = plan.remainingPeriods === 0
      ? "Target sleep time already reached."
      : `About ${plan.remainingPeriods} sleep period${plan.remainingPeriods === 1 ? "" : "s"} to reach the target at this pace.`;
    const shiftWindow = plan.formValues.currentMissionDay && plan.formValues.operationDay
      ? `Mission Day ${plan.formValues.currentMissionDay} to Day ${plan.formValues.operationDay}`
      : "Mission-day window not recorded";
    const caffeine = plan.formValues.caffeineInstruction
      ? escapeHTML(plan.formValues.caffeineInstruction)
      : "No timing or dose generated. Follow the minimum flight-surgeon-approved protocol only if needed.";
    const sleepAid = plan.formValues.sleepAidInstruction
      ? escapeHTML(plan.formValues.sleepAidInstruction)
      : "No timing or dose generated. Use only under the flight surgeon's instructions.";
    const countermeasures = getCountermeasureTimes(plan);
    const schedule = plan.schedule || [{
      day: plan.formValues.currentMissionDay || "—",
      bedtime: plan.recommendedBedtime,
      wake: plan.wakeTime,
      operations: [],
      lunar: "Legacy saved plan; regenerate to include the multi-day schedule."
    }];
    const scheduleMarkup = schedule.map((day) => {
      const operations = day.operations.length
        ? ` Operations: ${day.operations.map((operation) => `${operation.label} ${operation.start}–${operation.end}`).join("; ")}`
        : "";
      return `<div class="schedule-day"><strong>Day ${day.day}</strong><span>Sleep ${escapeHTML(day.bedtime)}–${escapeHTML(day.wake)}</span><p>${escapeHTML(day.lunar)}${escapeHTML(operations)}</p></div>`;
    }).join("");
    const conflictMessage = plan.conflict
      ? `<div class="plan-alert"><strong>Operation conflict</strong>This sleep opportunity overlaps the required awake operation. Operations take priority; coordinate a revised plan with the fatigue specialist.</div>`
      : "";
    const scheduleMessage = plan.scheduleRisk
      ? `<div class="plan-alert"><strong>Not enough transition time</strong>${escapeHTML(shiftWindow)} allows ${Math.max(0, plan.daysToOperation) * (MAX_DAILY_SHIFT_MINUTES / 60)} hours of gradual shift at the 2-hour-per-day ceiling, but the requested target needs more. Coordinate a revised sleep target or operation plan.</div>`
      : "";

    planOutput.innerHTML = `
      ${conflictMessage}
      ${scheduleMessage}
      <div class="plan-item"><span class="plan-time">${escapeHTML(plan.windDown)}</span><div class="plan-detail"><strong>Wind-down</strong><p>Begin a low-stimulation wind-down period ahead of sleep.</p></div></div>
      <div class="plan-item"><span class="plan-time">${escapeHTML(plan.recommendedBedtime)}</span><div class="plan-detail"><strong>Recommended sleep onset</strong><p>${escapeHTML(shiftWindow)}. ${escapeHTML(shiftSummary)} ${escapeHTML(periodsSummary)} This prototype caps shifts at 2 hours per 24 hours.</p></div></div>
      <div class="plan-item"><span class="plan-time">${escapeHTML(plan.wakeTime)}</span><div class="plan-detail"><strong>Recommended wake time</strong><p>${escapeHTML(plan.sleepHours)} hours of planned sleep opportunity.</p></div></div>
      <div class="plan-item"><span class="plan-time">Planned</span><div class="plan-detail"><strong>Nap</strong><p>${escapeHTML(countermeasures.nap)}</p></div></div>
      <div class="plan-item"><span class="plan-time">Protocol</span><div class="plan-detail"><strong>Caffeine</strong><p>${escapeHTML(countermeasures.caffeine)} ${caffeine}</p></div></div>
      <div class="plan-item"><span class="plan-time">Protocol</span><div class="plan-detail"><strong>Sleep aid</strong><p>${escapeHTML(countermeasures.sleepAid)} ${sleepAid}</p></div></div>
      <div class="plan-item"><span class="plan-time">Mission plan</span><div class="plan-detail"><strong>Light, exercise, and operations</strong><p>Reduce bright/blue-enriched light during wind-down, avoid vigorous exercise close to sleep, and protect the required awake window. ${escapeHTML(countermeasures.operation)}</p></div></div>
      <div class="plan-item"><span class="plan-time">Risk input</span><div class="plan-detail"><strong>Recent sleep debt</strong><p>${escapeHTML(sleepDebt.toFixed(1))} hours accumulated across the latest seven feedback entries. After three or more entries, the planned sleep opportunity is blended with the crew member's observed average.</p></div></div>
      <div class="plan-item schedule-item"><span class="plan-time">Glide path</span><div class="plan-detail"><strong>Multi-day schedule</strong>${scheduleMarkup}</div></div>
    `;
  }

  function renderFeedback(feedback) {
    const history = $("#feedback-history");
    if (!feedback.length) {
      history.innerHTML = "";
      return;
    }
    history.innerHTML = feedback.slice(-5).reverse().map((entry) => {
      const date = new Date(entry.date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const bedtime = entry.actualBedtime ? ` · onset ${escapeHTML(entry.actualBedtime)}` : "";
      const nap = entry.napCompleted && entry.napCompleted !== "unknown"
        ? ` · nap ${escapeHTML(entry.napCompleted)}`
        : "";
      return `<div class="feedback-entry"><span><strong>${escapeHTML(date)}</strong> · ${escapeHTML(entry.actualSleep)} h sleep${bedtime}${nap}</span><span>Alertness ${escapeHTML(entry.alertness)}/5</span></div>`;
    }).join("");
  }

  function renderSavedData() {
    const data = getCrewData(activeCrewId);
    currentPlan = data.plan;
    renderPlan(currentPlan);
    renderFeedback(data.feedback);
    $("#save-status").textContent = currentPlan ? "Loaded this crew member's saved plan." : "";
    if (currentPlan && currentPlan.formValues) {
      for (const [key, value] of Object.entries(currentPlan.formValues)) {
        const input = planForm.elements.namedItem(key);
        if (input && (typeof value === "string" || typeof value === "number")) input.value = String(value);
      }
    }
  }

  function handleStorageError(error, element, prefix) {
    const detail = error instanceof Error ? error.message : "Unknown browser storage error.";
    setMessage(element, `${prefix}: ${detail}`);
  }

  $("#login-tab").addEventListener("click", () => setAuthMode("login"));
  $("#create-tab").addEventListener("click", () => setAuthMode("create"));

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(authMessage, "");

    if (!crypto.subtle) {
      setMessage(authMessage, "Password protection requires a browser with Web Crypto support. Open this page in a current browser.");
      return;
    }

    const form = new FormData(authForm);
    const crewId = String(form.get("crewId")).trim().toLowerCase();
    const password = String(form.get("password"));
    if (!/^[a-z0-9_-]{3,24}$/.test(crewId)) {
      setMessage(authMessage, "Crew ID must be 3–24 characters using letters, numbers, hyphens, or underscores.");
      return;
    }
    if (password.length < 8) {
      setMessage(authMessage, "Password must be at least 8 characters.");
      return;
    }

    try {
      const accounts = getAccounts();
      if (authMode === "create") {
        const name = String(form.get("name")).trim();
        const role = String(form.get("role")) === "fatigue-specialist" ? "fatigue-specialist" : "crew";
        const confirmPassword = String(form.get("confirmPassword"));
        if (!name) {
          setMessage(authMessage, "Enter a crew member name.");
          return;
        }
        if (password !== confirmPassword) {
          setMessage(authMessage, "The passwords do not match.");
          return;
        }
        if (accounts.some((account) => account.id === crewId)) {
          setMessage(authMessage, "That Crew ID already has a local account. Choose another ID or sign in.");
          return;
        }
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const passwordHash = await hashPassword(password, salt);
        accounts.push({ id: crewId, name, role, color: getAvailableCrewColor(accounts, crewId), salt: encodeBytes(salt), passwordHash });
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
        saveCrewData(crewId, { plan: null, feedback: [] });
        showPlanner(crewId);
      } else {
        const account = accounts.find((candidate) => candidate.id === crewId);
        if (!account) {
          setMessage(authMessage, "No local account was found for that Crew ID.");
          return;
        }
        const enteredHash = await hashPassword(password, decodeHex(account.salt));
        if (!equalHashes(enteredHash, account.passwordHash)) {
          setMessage(authMessage, "Incorrect Crew ID or password.");
          return;
        }
        showPlanner(crewId);
      }
    } catch (error) {
      handleStorageError(error, authMessage, "Could not access local account data");
    }
  });

  copyConstraintsButton.addEventListener("click", async () => {
    const constraints = copyConstraintsButton.dataset.constraints;
    if (!constraints) return;
    try {
      await navigator.clipboard.writeText(constraints);
      setMessage(planMessage, "Ops constraints copied to the clipboard.", true);
    } catch (error) {
      handleStorageError(error, planMessage, "Could not copy Ops constraints");
    }
  });

  $("#logout-button").addEventListener("click", () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      showAuth();
      authForm.reset();
      setAuthMode("login");
    } catch (error) {
      handleStorageError(error, planMessage, "Could not sign out");
    }
  });

  planForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setMessage(planMessage, "");
    $("#save-status").textContent = "";

    const form = new FormData(planForm);
    const operationStart = String(form.get("operationStart"));
    const operationEnd = String(form.get("operationEnd"));
    const currentMissionDay = Number(form.get("currentMissionDay"));
    const operationDay = Number(form.get("operationDay"));
    if (Boolean(operationStart) !== Boolean(operationEnd)) {
      setMessage(planMessage, "Enter both operation times, or leave both blank.");
      return;
    }
    if (!Number.isInteger(currentMissionDay) || !Number.isInteger(operationDay) ||
      currentMissionDay < 1 || currentMissionDay > 365 ||
      operationDay < currentMissionDay || operationDay > 365) {
      setMessage(planMessage, "Mission days must be whole numbers from 1 to 365, with the operation on or after the plan start day.");
      return;
    }
    const sleepHours = Number(form.get("sleepDuration"));
    if (!Number.isFinite(sleepHours) || sleepHours < 5 || sleepHours > 10) {
      setMessage(planMessage, "Sleep opportunity must be between 5 and 10 hours.");
      return;
    }
    const formValues = {
      currentBedtime: String(form.get("currentBedtime")),
      targetBedtime: String(form.get("targetBedtime")),
      direction: String(form.get("direction")),
      sleepDuration: String(sleepHours),
      currentMissionDay,
      operationDay,
      operationStart,
      operationEnd,
      caffeineInstruction: String(form.get("caffeineInstruction")).trim(),
      sleepAidInstruction: String(form.get("sleepAidInstruction")).trim(),
      operations: parseOperations(form.get("operations"), operationStart, operationEnd, currentMissionDay),
      lightCycleStart: Number(form.get("lightCycleStart")) || null,
      lightCycleLength: Number(form.get("lightCycleLength")) || null
    };
    try {
      const data = getCrewData(activeCrewId);
      const latestAlertness = data.feedback.length
        ? Number(data.feedback[data.feedback.length - 1].alertness)
        : 3;
      currentPlan = makePlan(formValues, latestAlertness, data.feedback);
      data.plan = currentPlan;
      saveCrewData(activeCrewId, data);
      renderPlan(currentPlan);
      $("#save-status").textContent = "Plan saved for this crew member on this device.";
    } catch (error) {
      handleStorageError(error, planMessage, "Could not save the plan");
    }
  });

  $("#feedback-form").addEventListener("submit", (event) => {
    event.preventDefault();
    setMessage(feedbackMessage, "");
    const form = new FormData(event.currentTarget);
    const actualSleep = Number(form.get("actualSleep"));
    const alertness = Number(form.get("alertness"));
    if (!Number.isFinite(actualSleep) || actualSleep < 0 || actualSleep > 16) {
      setMessage(feedbackMessage, "Sleep achieved must be between 0 and 16 hours.");
      return;
    }
    try {
      const data = getCrewData(activeCrewId);
      data.feedback.push({
        date: new Date().toISOString(),
        actualSleep,
        alertness,
        actualBedtime: String(form.get("actualBedtime")),
        napCompleted: String(form.get("napCompleted"))
      });
      data.feedback = data.feedback.slice(-30);
      if (data.plan) {
        data.plan.score = calculateFatigueScore(
          actualSleep,
          data.plan.shiftHours,
          alertness,
          data.plan.sleepDebt || 0,
          data.plan.formValues.operations?.length || 0
        );
      }
      saveCrewData(activeCrewId, data);
      currentPlan = data.plan;
      renderPlan(currentPlan);
      renderFeedback(data.feedback);
      setMessage(feedbackMessage, "Feedback saved locally for this crew member.", true);
    } catch (error) {
      handleStorageError(error, feedbackMessage, "Could not save feedback");
    }
  });

  try {
    const activeCrewIdFromSession = sessionStorage.getItem(SESSION_KEY);
    if (activeCrewIdFromSession) showPlanner(activeCrewIdFromSession);
  } catch (error) {
    handleStorageError(error, authMessage, "Could not restore this local session");
  }
})();