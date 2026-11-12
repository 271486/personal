# SSRS Student Project Video

**Target length:** about 2 minutes  
**Format:** narration with screen capture and simple diagrams  
**Audience:** NASA HUNCH reviewers, fatigue specialists, and students  
**Production note:** Use a local demo with synthetic crew IDs only. Do not show real health data or passwords.

## Storyboard and narration

| Time | Visual | Narration |
|---|---|---|
| 0:00–0:12 | Moon habitat exterior, then a mission timeline with sleep and EVA blocks | “On a lunar mission, changing operations and long communication delays can make sleep planning difficult. Crew members need an onboard way to review a proposed schedule when ground support is not immediately available.” |
| 0:12–0:28 | Title card: Sleep Shift Recommendation System; caption: Offline-first student prototype | “We built the Sleep Shift Recommendation System, an offline-first planning prototype. Its goal is to make schedule tradeoffs easier to see—not to replace the crew, flight surgeon, fatigue specialist, or mission control.” |
| 0:28–0:45 | Start the local server, sign in with a synthetic Crew ID, and show the privacy limitation note | “The local Node server stores demo accounts, plans, and feedback in SQLite on this device. Passwords are hashed, but this is not mission-grade authentication or encrypted health-data storage.” |
| 0:45–1:05 | Enter current and target sleep onset, sleep opportunity, optional mission day and operation; build plan | “The main planner starts with sleep times and sleep opportunity. Optional mission details can be expanded. Each sleep-onset step is limited to one hour, and the app flags operation overlap rather than moving an operation.” |
| 1:05–1:22 | Highlight wind-down, sleep, wake, operation warning, and planning indicator disclaimer | “The result shows a proposed wind-down, sleep onset, wake time, and operation conflict when one exists. Its numeric indicator is an unvalidated demonstration heuristic. It is not a clinical fatigue score or a fitness-for-duty decision.” |
| 1:22–1:40 | Submit feedback; show the next mission day, updated sleep time, and saved feedback | “Saving feedback advances the plan by one mission day. Reported sleep onset, or the planned onset if not entered, starts the next step. After three sleep reports, average reported sleep also personalizes sleep opportunity. This simple rule is not a validated learning model.” |
| 1:40–1:54 | Show evidence notes; icons for wearable, lab test, and protocol | “Our supplied research notes also highlight an important boundary: wearable signals are estimates or context, not direct measurements of melatonin or caffeine. The prototype therefore does not invent caffeine or sleep-aid dosing or timing.” |
| 1:54–2:08 | Show requirements document and future-work checklist | “The next steps are specialist review, a validated fatigue model, secure mission access controls, hardware testing, and human-factors evaluation. Until those gates are met, the tool is for synthetic-data demonstration only.” |
| 2:08–2:15 | Closing slide: Plan carefully. Review with experts. Operations first. | “SSRS: a starting point for safer, clearer sleep-shift planning—built around offline use, transparent limits, and human oversight.” |

## On-screen safety caption

> Student prototype. Not for medical or operational decisions. Use synthetic data only. Mission operations and approved flight-surgeon/fatigue-specialist guidance take priority.

## Production checklist

- Start the app with `npm start`; capture the local app without a cloud connection and show the Offline-ready label.
- Use made-up names, Crew IDs, schedules, and feedback.
- Do not show medications, dose instructions, real biometric data, or actual crew identity.
- Add captions for narration and keep safety text readable.
- Credit NASA HUNCH as the project program; do not imply NASA approval or flight qualification.
- Record final runtime and confirm the exported video has audio, captions, and readable text.

## Likely reviewer questions

**How does feedback change the plan?**  
Saving sleep/alertness feedback advances the mission day by one. Reported sleep onset becomes the next starting point; when it is omitted, the previous planned onset is used. After three sleep reports, average reported sleep is blended with the selected sleep opportunity. This is a simple rule, not machine learning or a validated model.

**What does the planning indicator mean?**  
It is a transparent, unvalidated prototype heuristic combining selected sleep opportunity, sleep shift, recent sleep debt, operations, and reported alertness. It is not a clinical fatigue score or a fitness-for-duty assessment.

**Why limit changes to one hour?**  
It is a conservative prototype rule selected for this demonstration, not a medical recommendation. A fatigue specialist must review and approve any operational limit.

**Why no medication or sensor recommendations?**  
The supplied material does not provide an approved individual dosing protocol or validated sensor-to-hormone model. The application does not infer hormone levels or invent caffeine/sleep-aid timing.

**Is the database secure or flight-ready?**  
No. SQLite keeps demo data on the local device and passwords are stored as salted hashes, but the database is unencrypted and the local API is not mission-grade access control. Use synthetic data only.

**What is the key innovation demonstrated?**  
The prototype combines a readable multi-day sleep glide path, operation-conflict visibility, and a feedback loop that updates the next plan, while keeping human review and operational authority explicit.
