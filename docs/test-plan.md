# Test Plan — QA Automation Suite

## 1. Purpose

This document defines the verification and validation (V&V) strategy for the
system under test, the scope of automated coverage, and traceability between
requirements and test cases — following the same structure expected in a
production software assurance environment.

## 2. Verification vs. Validation

| | Verification | Validation |
|---|---|---|
| **Question answered** | "Are we building it right?" | "Are we building the right thing?" |
| **Method in this suite** | Unit tests (`tests/unit/`) check individual functions against their specification in isolation. API tests (`tests/api/`) check that endpoints conform to their documented contract (status codes, schema). | UI tests (`tests/ui/`) check that real user-facing flows (login, navigation, error handling) behave as an actual end user would expect. |
| **Example** | `isStrongPassword()` correctly enforces the password policy as specified. | A user who enters wrong credentials actually *sees* a visible, correctly worded error message in the browser. |

## 3. Scope

**In scope:**
- Authentication flow (login success, login failure, validation)
- Representative API contract checks (status codes, schema, response time)
- Core validation logic (email, password, username sanitization)

**Out of scope (for this demo):**
- Load/performance testing
- Security penetration testing
- Cross-browser matrix beyond Chromium (would be added via Playwright's
  multi-project config in a production setting)

## 4. Test Levels

1. **Unit** — Vitest, no network calls, milliseconds to run, run on every commit.
2. **API/Integration** — Vitest + `fetch`, validates contracts against a live (test) API.
3. **End-to-End (E2E)** — Playwright, Page Object Model, validates real browser behavior.

## 5. Traceability Matrix

| Test Case ID | Requirement | Test Level | File |
|---|---|---|---|
| TC-AUTH-001 | Valid login succeeds and lands on dashboard | E2E | `tests/ui/login.spec.ts` |
| TC-AUTH-002 | Invalid login shows error message | E2E | `tests/ui/login.spec.ts` |
| TC-AUTH-003 | Empty required field blocks submission | E2E | `tests/ui/login.spec.ts` |
| TC-API-001 | GET user returns 200 + valid schema | API | `tests/api/employee-api.spec.ts` |
| TC-API-002 | GET non-existent user returns 404 | API | `tests/api/employee-api.spec.ts` |
| TC-API-003 | API response time under 2000ms | API (non-functional) | `tests/api/employee-api.spec.ts` |
| TC-UNIT-001/002 | Email validation logic | Unit | `tests/unit/validators.spec.ts` |
| TC-UNIT-003/004/005 | Password strength logic | Unit | `tests/unit/validators.spec.ts` |
| TC-UNIT-006 | Username sanitization logic | Unit | `tests/unit/validators.spec.ts` |

## 6. Pass/Fail Criteria

- A build is considered **passing** when 100% of unit and API tests pass, and
  E2E tests pass with zero flaky retries on the `main` branch.
- Any UI test requiring more than 1 retry to pass is flagged for review
  (potential flakiness) even if it ultimately passes — tracked as a
  process-improvement defect (see `defect-reports.md`, DEF-003).

## 7. Defect Workflow

1. Automated test fails in CI.
2. Failure triage: reproduce locally, classify as **product defect**,
   **test defect**, or **environment issue**.
3. Product defects are logged using the standard format in
   `defect-reports.md` and would be raised in Jira in a live environment.
4. Fix is verified by re-running the specific failing test case, then the
   full regression suite before merge.

## 8. Tooling Summary

| Tool | Purpose |
|---|---|
| Playwright | E2E browser automation, Page Object Model |
| Vitest | Fast unit + API-level testing |
| Docker | Reproducible, environment-independent test execution |
| GitHub Actions | CI — runs full suite on every push/PR |
| TypeScript | Type safety across all test layers |
