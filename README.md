# QA Automation Suite — TypeScript / Playwright / Vitest / Docker

A self-contained software assurance project demonstrating end-to-end test automation,
API testing, defect documentation, and CI/CD — built to mirror a real-world
Software Assurance Engineer workflow (UI + API + Docker + Jira-style defect tracking).

This project was built to apply modern test automation practices to a real,
publicly accessible system, while documenting the *process* — not just the
test code — the way a QA team would in a production environment.

**Target system under test:** [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/) —
a public open-source HR management demo app, used here purely as a stable, free target
for automated testing (no production system involved).

## What this demonstrates

This repo shows hands-on experience with the exact toolchain used in
modern Software Assurance / QA Engineer roles:

| Requirement | Where it's covered |
|---|---|
| TypeScript | Entire suite written in TypeScript |
| Playwright | `tests/ui/` — UI automation with Page Object Model |
| Vitest | `tests/api/` and `tests/unit/` — API and unit-level tests |
| Docker | `Dockerfile` + `docker-compose.yml` — containerized, reproducible test runs |
| Jira / defect tracking | `docs/defect-reports.md` — sample bug reports in standard Jira format |
| V&V methodology | `docs/test-plan.md` — verification vs. validation strategy, traceability matrix |
| CI/CD | `.github/workflows/test.yml` — automated test run on every push |

## Three layers of testing — and what each one is for

| Layer | Tool | Question it answers | Speed |
|---|---|---|---|
| Unit | Vitest | Does this individual function behave correctly in isolation? | Fastest |
| API | Vitest + `fetch` | Does the API return the right status codes, schema, and timing? | Fast |
| E2E (UI) | Playwright | Does a real user, in a real browser, get the experience they should? | Slowest, most realistic |

Each layer catches different bugs. A function can pass its unit test but
still produce a broken page if the UI never calls it correctly — that's
why all three layers exist together rather than relying on just one.

## Tech Stack

- **TypeScript** — primary language across all tests
- **Playwright** — UI end-to-end testing (Page Object Model pattern)
- **Vitest** — fast unit + API-level testing
- **Docker** — containerized test execution
- **GitHub Actions** — CI pipeline

## Project Structure

```
qa-automation-suite/
├── tests/
│   ├── ui/                  # Playwright E2E tests (POM pattern)
│   │   ├── pages/           # Page Object classes
│   │   └── login.spec.ts
│   ├── api/                 # Vitest API tests
│   │   └── employee-api.spec.ts
│   └── unit/                 # Vitest unit tests
│       └── validators.spec.ts
├── docs/
│   ├── test-plan.md         # V&V strategy + traceability matrix
│   └── defect-reports.md    # Sample defect reports (Jira-style)
├── .github/workflows/test.yml
├── Dockerfile
├── docker-compose.yml
├── playwright.config.ts
├── vitest.config.ts
├── package.json
└── tsconfig.json
```

## Running locally

```bash
npm install
npx playwright install --with-deps

# Run UI tests (Playwright)
npm run test:ui

# Run API + unit tests (Vitest)
npm run test:api
npm run test:unit

# Run everything
npm run test:all
```

## Running in Docker (no local setup needed)

```bash
docker build -t qa-automation-suite .
docker run --rm qa-automation-suite
```

or with docker-compose:

```bash
docker-compose up --build
```

## CI/CD

Every push triggers `.github/workflows/test.yml`, which runs the full suite
(UI + API + unit) inside a clean container and uploads the Playwright HTML
report as a build artifact.

## Sample Test Run Output

Unit test run (`npm run test:unit`):

```
 ✓ tests/unit/validators.spec.ts (6)
   ✓ isValidEmail (2)
     ✓ TC-UNIT-001: accepts a well-formed email
     ✓ TC-UNIT-002: rejects an email missing the @ symbol
   ✓ isStrongPassword (3)
     ✓ TC-UNIT-003: accepts a password with uppercase, number, and 8+ chars
     ✓ TC-UNIT-004: rejects a password under 8 characters
     ✓ TC-UNIT-005: rejects a password with no uppercase letter
   ✓ sanitizeUsername (1)
     ✓ TC-UNIT-006: trims, lowercases, and strips invalid characters

 Test Files  1 passed (1)
      Tests  6 passed (6)
```

> Add your own screenshots here once you run the suite. After running
> `npm run test:ui`, Playwright generates an HTML report — open it with
> `npx playwright show-report`, then screenshot the results page and save
> it into a `screenshots/` folder in this repo. Reference it like:
> `![UI test report](./screenshots/playwright-report.png)`

## Troubleshooting Notes (real issues hit while building this)

- **Node version**: This project requires **Node 18+**. On older Node
  versions (e.g. 16), Vitest fails at startup with
  `crypto.getRandomValues is not a function`. Use
  [nvm](https://github.com/nvm-sh/nvm) to install and switch to Node 20.
- **Playwright on older macOS**: WebKit is not supported on macOS 12
  (Monterey) and earlier. This project only targets Chromium
  (see `playwright.config.ts`), so install just that browser:
  `npx playwright install chromium --with-deps`.
- **Third-party test APIs change over time**: an earlier version of the
  API tests targeted `reqres.in`, which began requiring a paid/registered
  API key. The suite now targets `jsonplaceholder.typicode.com`, a free,
  no-auth-required public test API, so the tests run for anyone cloning
  this repo without extra signup.



- [`SETUP.md`](./SETUP.md) — full setup instructions plus a real troubleshooting log of every environment issue hit while building this project on macOS (Node version conflicts, Playwright/macOS compatibility, third-party API changes, GitHub authentication)
- [`docs/test-plan.md`](./docs/test-plan.md) — verification vs validation approach, scope, traceability
- [`docs/defect-reports.md`](./docs/defect-reports.md) — sample defects found during testing, written in standard bug-report format
