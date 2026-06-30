# Defect Reports

Sample defects documented in standard bug-report format, as would be logged
in Jira during a real test cycle. These illustrate defect-management practice
(severity classification, repro steps, expected vs. actual) referenced in the
test plan's defect workflow.

---

### DEF-001

| Field | Value |
|---|---|
| **Title** | Login error message not announced to screen readers |
| **Severity** | Medium |
| **Priority** | P2 |
| **Status** | Open |
| **Found in** | TC-AUTH-002 (manual follow-up after automated test passed functionally) |
| **Environment** | Chromium, desktop |

**Steps to Reproduce:**
1. Navigate to the login page.
2. Enter invalid credentials and submit.
3. Observe the error message region using a screen reader (e.g. NVDA).

**Expected Result:** The error message is announced automatically via an
`aria-live` region, since the page does not navigate after submission.

**Actual Result:** The error text appears visually but is not associated
with an `aria-live` attribute, so screen reader users are not notified of
the failed login attempt.

**Notes:** Test automation confirmed the message renders correctly
(TC-AUTH-002 passes), but this is a usability/accessibility gap that
functional automation alone won't catch — flagged here as a reminder that
automated pass ≠ full V&V coverage.

---

### DEF-002

| Field | Value |
|---|---|
| **Title** | API returns 200 instead of 422 for malformed email on create | 
| **Severity** | Low |
| **Priority** | P3 |
| **Status** | Open |
| **Found in** | Exploratory testing alongside TC-API-001 |
| **Environment** | API (test environment) |

**Steps to Reproduce:**
1. Send a POST request to create a user with `email: "not-an-email"`.
2. Observe the response status code and body.

**Expected Result:** API should return `422 Unprocessable Entity` with a
validation error describing the malformed field.

**Actual Result:** API accepts the payload and returns `200 OK`, persisting
an invalid email format.

**Notes:** This is a contract gap worth raising with the development team —
recommend adding server-side validation, plus a corresponding negative test
case (would be added as TC-API-004 once fixed).

---

### DEF-003

| Field | Value |
|---|---|
| **Title** | TC-AUTH-001 occasionally requires one retry in CI |
| **Severity** | Low (process) |
| **Priority** | P3 |
| **Status** | Investigating |
| **Found in** | CI pipeline (GitHub Actions) |
| **Environment** | CI container, Chromium |

**Steps to Reproduce:**
1. Run the full suite in CI multiple times across different days.
2. Observe intermittent retry needed for TC-AUTH-001 only.

**Expected Result:** Test passes consistently on first attempt.

**Actual Result:** Approximately 1 in 15 runs requires a single retry,
suggesting a timing/network-latency race condition rather than a product
defect.

**Notes:** Logged per the test plan's flakiness policy (Section 6).
Next step: add an explicit wait on a stable post-login element rather than
relying solely on navigation timing.
