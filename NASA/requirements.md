# Lunar Sleep-Shift Scheduling Tool

## System Requirements and End-User Access Protocol

**Project:** NASA HUNCH SFT 2026–27  
**Working name:** Sleep Shift Recommendation System (SSRS)  
**Revision:** Student MVP concept, October 2026

## 1. Purpose

SSRS is an offline planning aid for fatigue specialists and crew members who need to explore a gradual sleep/wake schedule around mission operations. It records a crew member's plan and self-reported feedback locally, then presents the information for human review.

The current browser prototype demonstrates per-crew local accounts, a one-period schedule, operation-overlap warnings, and feedback capture. It is not a certified fatigue model, medical device, operational authorization system, or flight-qualified product.

## 2. Users and access protocol

### Intended users

| User | Need | Intended access |
|---|---|---|
| Fatigue-management specialist | Review crew inputs, propose or approve schedules, interpret trends, and support crew planning | Authorized specialist account; access limited to assigned mission/crew; approval and change history |
| Crew member | Review their own plan, report sleep and alertness, and request a change | Individual account; read own approved plan and submit own feedback |

### Prototype access

1. Each crew member creates a local account using a Crew ID and password.
2. Passwords are stored as salted PBKDF2 hashes; plans and feedback are stored in the browser's local storage.
3. A signed-in browser session is tracked in session storage.
4. The prototype has no specialist role, centralized account provisioning, multi-device synchronization, encrypted health-data store, or reliable protection from someone with access to the device/browser profile.
5. Accounts created in one browser do not transfer to another device. Clearing browser data can permanently remove accounts and plans.

These controls are suitable only for a classroom demonstration with synthetic or non-sensitive data. They do not meet mission access-control requirements.

### Required mission access protocol (not implemented)

- A mission administrator or authorized fatigue specialist provisions accounts before use; crew cannot self-assign specialist privileges.
- Enforce unique identities, role-based access, least privilege, account revocation, inactivity lock, and authenticated specialist approval.
- A crew member can view only their own data. A specialist can view only assigned crew. Administrative access is auditable.
- Authenticate locally without requiring a network connection; define key recovery, device loss, crew reassignment, and emergency access procedures before deployment.
- Encrypt data at rest and in backups, protect local sessions, and provide an approved data export/deletion workflow.
- Never use face recognition as a required MVP dependency.

## 3. Scope and exclusions

### MVP scope

- Run without a network connection on a laptop or tablet with a supported browser.
- Accept current/target sleep onset, shift direction, sleep opportunity, and optional required-awake operation times.
- Suggest a conservative next sleep onset (at most one hour of shift per sleep period), wake time, and a two-hour wind-down placeholder.
- Flag overlap between the proposed sleep window and an entered required-awake operation.
- Display a clearly labeled, unvalidated planning indicator, with its limitations visible.
- Capture actual sleep and self-reported alertness, associated with the signed-in local crew account.
- Allow specialist-approved caffeine and sleep-aid instructions to be recorded as text; do not create a dose, medication plan, or autonomously inferred timing.
- Explain that sensor metrics are proxies and that the prototype does not measure hormones.

### Not in MVP

- Clinical diagnosis, fit-for-duty decisions, or automatically changing duty/task assignments.
- Operational scheduling-system integration, habitat lighting control, flight hardware, or HUD integration.
- Wearable/biometric ingestion, hormone measurement, or claims of continuous melatonin/caffeine sensing.
- SAFTE or another validated model unless the model, license, coefficients, validation evidence, and approval are provided by the sponsoring authority.
- Automatic medication dosing or melatonin/caffeine recommendations.
- Cloud services, telemetry, facial recognition, or unsupervised machine learning.

## 4. Functional requirements

| ID | Requirement | Acceptance / verification |
|---|---|---|
| FR-01 | The tool shall load its planning workflow without network access after its files are available on the device. | Disconnect network; load the local application and generate a plan. |
| FR-02 | The prototype shall keep each Crew ID's plan and feedback separate in the local browser. | Create two test accounts; verify each sees only their own saved plan and feedback. |
| FR-03 | The planner shall accept current sleep onset, target onset, shift direction, planned sleep opportunity, and optional operation start/end. | Submit valid values and verify they are reflected in the plan. |
| FR-04 | The demonstration algorithm shall shift sleep onset by no more than one hour per generated sleep period. | Test target gaps above one hour in both directions; verify each generated step is at most one hour. |
| FR-05 | The tool shall show a proposed wake time and an illustrative wind-down time. | Verify wake is onset plus selected sleep opportunity and wind-down is two hours before onset, including midnight rollover. |
| FR-06 | The tool shall warn when the proposed sleep interval overlaps a required-awake operation. | Test overlap, no-overlap, and overnight intervals. |
| FR-07 | The tool shall retain caffeine and sleep-aid instructions only when entered by a user with approved protocol information. | Leave fields blank; verify no dose/timing is invented. Enter approved text; verify it is displayed as entered. |
| FR-08 | The tool shall capture actual sleep and a 1–5 self-reported alertness value. | Save feedback and verify it is associated with the active Crew ID and persists locally. |
| FR-09 | The tool shall clearly identify the numeric fatigue/planning score as an unvalidated demonstration heuristic. | Inspect plan output and documentation; the score is never described as a clinical or fitness-for-duty measure. |
| FR-10 | The tool shall explicitly state that wearable signals do not directly measure melatonin or caffeine concentration. | Inspect the evidence notes and requirements. |
| FR-11 | The tool shall surface errors for invalid input or unavailable/corrupt local storage rather than silently presenting a saved-plan success state. | Test invalid time pairs, malformed saved data, and storage failure where the test environment permits. |
| FR-12 | The tool shall preserve human operational authority: required operations and specialist/flight-surgeon instructions take precedence. | Verify warnings and explanatory text; no control action is sent to mission systems. |

## 5. Non-functional requirements

| ID | Requirement | Acceptance / verification |
|---|---|---|
| NFR-01 | The MVP shall have no runtime dependency on cloud access or external APIs. | Inspect network activity while using each feature offline. |
| NFR-02 | The interface shall support keyboard operation, visible focus, labeled fields, and screen-reader status announcements. | Manual accessibility pass on supported browsers. |
| NFR-03 | The interface shall remain usable on laptop and tablet-sized viewports. | Test representative narrow and wide viewport sizes. |
| NFR-04 | Inputs and displayed user text shall be validated/escaped. | Test malformed values and HTML-like content in instruction fields. |
| NFR-05 | The architecture shall keep planning logic separable from UI so a reviewed model can replace the demonstration heuristic. | Code review and unit tests for scheduling logic. |
| NFR-06 | Data integrity, backup, encryption, account recovery, and retention shall be defined before any real crew data is entered. | Sponsor security/privacy review; current prototype fails this deployment gate. |

## 6. Hardware and software concept

### MVP demonstration

- **Hardware:** laptop or tablet capable of running a current standards-compliant browser. No wearable, network interface, or dedicated sensor is required.
- **Software:** static HTML, CSS, and JavaScript; browser Web Crypto for password hashing; local storage for prototype account/plan data; session storage for the active browser session.
- **Connectivity:** no network required during planning. Files can be opened from an approved local origin; supported-browser/Web Crypto behavior must be tested on the target device.
- **Storage:** browser-managed and device-local. Capacity, durability, backup, and security are not guaranteed by this prototype.
- **Time:** user-entered 24-hour clock values. Mission time zone/epoch, daylight-saving rules, clock synchronization, and lunar mission time standard remain mission-level decisions.

### Flight candidate (future; not specified by this prototype)

- Mission-approved laptop/tablet and operating system; formally baselined browser/runtime.
- Signed application package, verified updates, offline dependency inventory, and rollback procedure.
- Encrypted local database with access-control enforcement, audit log, integrity checks, export/backup, and tested recovery.
- Interface to an approved operations timeline only after interface-control, authority, and failure-mode reviews.
- Optional sensor adapters only for approved devices and documented data formats; sensor data must include source, timestamp, quality, and units.
- Hardware memory, storage, power, radiation tolerance, and environment limits are TBD with the sponsoring engineering authority. This student project does not assert flight qualification.

## 7. Schedule and recommendation rules

1. Operations always take priority. A conflict is highlighted, not automatically resolved by moving an operation.
2. The prototype caps a single sleep-onset adjustment at one hour per sleep period. This is a deliberately conservative demonstration rule; a fatigue specialist must validate the operational rule.
3. Sleep opportunity is user supplied within the current demonstration's 5–10 hour input range. This does not establish an individual's medical sleep need.
4. The wind-down time is an illustrative two-hour offset, not a personalized or experimentally validated recommendation.
5. Nap guidance is intentionally general. Exact timing, duration, and operational suitability require approved fatigue-management guidance.
6. Caffeine calculations are not implemented. The supplied notes describe a generic five-to-six-hour half-life estimate, but do not support individual clearance, an allowable dose, or a safe cut-off time.
7. Melatonin timing/dose is not generated. The supplied notes describe laboratory DLMO assessment and do not provide a clinically approved medication protocol.
8. Light and exercise advice is limited to following the mission-approved plan; the prototype does not control lighting or assign exercise.
9. The numeric score currently combines selected sleep opportunity, current shift size, and most recent self-reported alertness using a simple unvalidated formula. It is not a predictive fatigue model and must not be used for operational decisions.
10. Feedback is stored for review. A future adaptive system must have defined training data, validation, uncertainty display, human approval, and a safe rollback path before changing recommendations.

## 8. Evidence and data-quality assessment

The only supplied research file is a compilation of informal summaries and links about consumer wearables, biomarkers, and possible system architecture. It is not a peer-reviewed literature review, a clinical guideline, a validated algorithm specification, or evidence of NASA/flight approval. Some claims are speculative, commercially framed, or internally inconsistent. The current application therefore treats it as a prompt to distinguish measured data from estimated proxies—not as authorization for medical advice.

Design implications:

- A sleep tracker may estimate sleep from movement and other signals; do not represent those estimates as measured sleep stages without device validation.
- HRV, heart rate, skin temperature, movement, and ambient light can be contextual observations, not direct cortisol, adrenaline, or melatonin measurements.
- A generic caffeine half-life model is an estimate, not a blood level or an individualized prediction.
- DLMO requires an appropriate measurement protocol; an app cannot infer hormone concentration from a consumer wearable.
- The supplied notes' suggestion of rapid 2–3-hour “slam shifts” conflicts with this brief's gradual-shifting constraint and is not implemented.
- The supplied notes' references to SAFTE and specific model equations do not contain an implementation-ready or licensed/validated specification. No SAFTE equivalence is claimed.

### Source traceability

- **S-1:** NASA HUNCH SFT 2026–27 project brief supplied in the user prompt (requirements, constraints, user groups, and success examples).
- **S-2:** `NASAHUNCH Biomedical Melatonin Tracking (Laboratory Tests vs. Models).txt`, supplied by the user. Used only as an unverified background summary for measurement-versus-estimation distinctions; individual claims require source verification.

## 9. Mission requirements and principal challenges

- **Offline operations:** no cloud or ground connection may be necessary to generate or read a plan.
- **Communication delay:** lunar/Martian delay means plans and data validation must be available onboard; asynchronous ground review cannot be assumed.
- **Lunar light/dark environment:** habitat artificial lighting and mission schedule must be treated as controlled inputs, not assumed to match Earth day/night. The sponsor must define the relevant mission timebase and light plan.
- **Frequent operations/EVA:** operation windows can conflict with sleep; the tool should flag conflicts and preserve operations as authoritative.
- **Individual variation:** sleep need and circadian response vary; one generic number cannot stand in for a validated individual model.
- **Team coordination:** team shifts may be necessary but can create shared coverage gaps; team schedule review belongs to mission operations.
- **Trustworthy fatigue assessment:** the prototype's score is not trustworthy enough for duty decisions; the sponsor must select and validate a model and define uncertainty and alert thresholds.
- **Data loss and device failure:** offline local storage can be lost or corrupted; a flight candidate needs tested recovery, exports, and conservative fallback procedures.
- **Human factors:** crew workload, time-zone/timebase clarity, override reasons, and understandable recommendations require evaluation with representative users.

## 10. Verification plan

| Test | Expected result |
|---|---|
| Offline load and planning | Core page and schedule workflow work without network access. |
| Account isolation | Crew A cannot view Crew B's saved plan through the normal UI. |
| Authentication | Correct password opens the matching local account; incorrect password does not. |
| Shift bounds | Each recommended change is no greater than one hour; reaching the target requires multiple periods. |
| Midnight arithmetic | Onset, wake, and wind-down times wrap correctly across midnight. |
| Operation conflict | A sleep/operation overlap is flagged, including intervals crossing midnight. |
| Feedback persistence | Feedback remains associated with the correct local Crew ID after sign-out/sign-in. |
| Output safety | User-provided HTML-like text is displayed as text, not executed as markup. |
| Medical boundary | No autonomous caffeine or sleep-aid dose/timing is invented; evidence caveats remain visible. |
| Accessibility/responsive behavior | Keyboard, visible focus, labels, and tablet/narrow layouts are usable. |

## 11. Release gates before real crew use

1. Fatigue specialist and flight surgeon approve the clinical rules and language.
2. NASA/mission authority approves the algorithm, evidence base, safety case, and operating procedures.
3. Security/privacy review approves identity, encryption, recovery, audit, data retention, and incident handling.
4. Human-factors evaluation verifies crew comprehension, overrides, and workload.
5. Software verification, model validation, hazard analysis, and failure-recovery tests pass on target hardware.
6. Mission operations approves timebase and schedule integration. Until then, use synthetic data only.
