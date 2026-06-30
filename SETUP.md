# Setup Guide & Troubleshooting Log

This document walks through setting up this project from scratch on a fresh
machine, plus a real log of issues encountered while building and running it
on macOS — kept here intentionally, since working through environment
issues is a normal and expected part of software assurance work.

## Prerequisites

- **Node.js 18 or newer** (this project will not run on Node 16 or older —
  see Issue #1 below for why)
- **npm** (comes bundled with Node)
- **Git**
- **Docker** (optional — only needed if you want to run the suite in a
  container instead of locally)

## Step-by-step setup

### 1. Clone or download the project
```bash
git clone https://github.com/samradarakshan04/qa-automation-suite.git
cd qa-automation-suite
```

### 2. Check your Node version
```bash
node -v
```
If this shows anything below `v18.x`, upgrade before continuing (see Issue #1).

### 3. Install dependencies
```bash
npm install
```

### 4. Install Playwright's browser
This project only runs tests against Chromium (see `playwright.config.ts`),
so only that browser is needed:
```bash
npx playwright install chromium --with-deps
```

### 5. Run the test suites
```bash
npm run test:unit   # fast, isolated function tests
npm run test:api    # API contract tests
npm run test:ui     # Playwright browser tests
npm run test:all    # all three, in sequence
```

### 6. (Optional) Run everything inside Docker instead
```bash
docker build -t qa-automation-suite .
docker run --rm qa-automation-suite
```

---

## Issues Encountered & How They Were Resolved

### Issue #1 — `TypeError: crypto.getRandomValues is not a function`

**Symptom:** Running `npm run test:api` or `npm run test:unit` crashed
immediately at startup with this error coming from Vite/Vitest's internals.

**Root cause:** The machine was running **Node.js v16.14.0**. Node's Web
Crypto API (`crypto.getRandomValues`) isn't available until Node 18, and
Vite's dependency chain requires it.

**Fix:**
1. Installed `nvm` (Node Version Manager) to manage Node versions cleanly:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   ```
2. nvm didn't load automatically in new terminal sessions even after
   installation — `nvm -v` returned `command not found` despite the
   `~/.nvm` folder existing on disk with all its files. Manually sourcing it
   confirmed it was installed correctly, just not auto-loading:
   ```bash
   source ~/.nvm/nvm.sh
   ```
3. Installed and switched to Node 20:
   ```bash
   nvm install 20
   nvm alias default 20
   nvm use 20
   ```
4. Did a clean reinstall of dependencies, since `node_modules` built
   against the old Node version can leave stale native bindings:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

**Note:** If `nvm` stops being recognized again in a brand-new terminal
window, run `source ~/.nvm/nvm.sh` manually first before any `node`/`npm`
command. The permanent fix for this involves checking `~/.zshrc` for
conflicting or duplicate shell startup configuration.

---

### Issue #2 — Playwright browser install failure on macOS 12

**Symptom:**
```
Error: ERROR: Playwright does not support webkit on mac12
```

**Root cause:** Running `npx playwright install --with-deps` (without
specifying a browser) attempts to install **all** browsers Playwright
supports — Chromium, Firefox, and WebKit. WebKit is not supported on
macOS 12 (Monterey) or earlier.

**Fix:** This project's config (`playwright.config.ts`) only targets
Chromium anyway, so there was no need to install WebKit or Firefox at all:
```bash
npx playwright install chromium --with-deps
```

---

### Issue #3 — API tests failing with `401 Unauthorized`

**Symptom:**
```
AssertionError: expected 401 to be 200
AssertionError: expected 401 to be 404
```

**Root cause:** The API tests originally targeted `reqres.in`, a popular
public test API. At some point, `reqres.in` began requiring a registered
API key even on requests that previously worked without one — meaning the
placeholder key used in the original test code stopped being valid.

**Fix:** Rather than depending on a third-party service's authentication
policy (which could change again), the API tests were switched to target
[`jsonplaceholder.typicode.com`](https://jsonplaceholder.typicode.com), a
free, public, no-auth-required fake REST API designed specifically for this
kind of testing. This also makes the project easier for anyone else to
clone and run immediately, without needing to sign up for any external
service first. See `tests/api/employee-api.spec.ts` for the updated tests.

---

### Issue #4 — GitHub push authentication failure

**Symptom:**
```
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed
```

**Root cause:** GitHub removed support for authenticating `git push` over
HTTPS using a normal account password (a security change applied to all
GitHub accounts, not specific to this project).

**Fix:** Generated a GitHub **Personal Access Token** (Settings →
Developer settings → Personal access tokens → Tokens classic → Generate
new token → scope: `repo` only) and used that token as the password when
prompted during `git push`, instead of the GitHub account password.

**Security note:** A personal access token should be treated like a
password — never commit it to a repo, paste it into chat, or share it.
If a token is ever accidentally exposed, revoke it immediately on GitHub
and generate a new one.

---

### Issue #5 — `remote: repository not found`

**Symptom:**
```
fatal: repository 'https://github.com/USERNAME/qa-automation-suite.git/' not found
```

**Root cause:** The remote URL pointed at a repository that didn't exist
yet on GitHub — `git remote add origin <url>` only tells your local repo
*where* to push, it doesn't create the remote repo itself.

**Fix:** Created the empty repository first on GitHub.com (New repository →
name it `qa-automation-suite` → don't initialize with a README/.gitignore,
since the project already has both locally) — then re-ran `git push`.
