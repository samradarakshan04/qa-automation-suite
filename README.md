# QA Automation Suite — TypeScript / Playwright / Vitest / Docker

A self-contained software assurance project demonstrating end-to-end test automation,
API testing, defect documentation, and CI/CD — built to mirror a real-world
Software Assurance Engineer workflow (UI + API + Docker + Jira-style defect tracking).

**Target system under test:** [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/) —
a public open-source HR management demo app, used here purely as a stable, free target
for automated testing (no production system involved).

## Why this project exists

This repo was built to demonstrate hands-on experience with the exact toolchain used in
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

## Documentation

- [`docs/test-plan.md`](./docs/test-plan.md) — verification vs validation approach, scope, traceability
- [`docs/defect-reports.md`](./docs/defect-reports.md) — sample defects found during testing, written in standard bug-report format
