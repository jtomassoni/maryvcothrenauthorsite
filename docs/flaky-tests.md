# Flaky Test Documentation

## What is a Flaky Test?

A flaky test is a test that sometimes passes and sometimes fails without any relevant code changes. Failures are non-deterministic and often disappear on re-run.

## Baseline Definition (for our suite)

A test is considered "flaky" if, under identical conditions (same commit, same config, clean env):

- It fails ≥1 time in 10 consecutive runs, or
- It fails ≥2 times in 50 consecutive runs, or
- It shows inconsistent timing (timeouts that vanish on re-run) twice within the same run set.

We use the thresholds above during development; they're strict on purpose to catch instability early.

## Common Causes (in our context)

- **Race conditions** in the app (UI updates vs. assertions)
- **Slow/variable server responses** or background jobs
- **Unstable selectors** (DOM mutation, CSS-only hooks)
- **Insufficient test isolation** (state leakage across tests)
- **Clock/time-based behavior** (polling, debounce, animation)
- **Third-party dependencies** (analytics, maps, iframes)
- **Asynchronous effects** not properly awaited (modals, toasts)

## Detecting Flakiness During Development

### Use the Flaky Test Detector

1. **Tag the spec or suite**: `{ tags: '@flaky-check' }`
2. **Run the manual CI job**: `cypress_flaky_test_detection`
3. **Default runs**: 10 iterations (override with `FLAKY_TEST_ITERATIONS`)

### Development Workflow

1. While building a new e2e test, add `@flaky-check` to the suite
2. Run the detector locally or in CI for 10 iterations
3. If any failures: fix and rerun until 10/10 pass
4. For high-value or historically brittle flows, run 50 iterations before merging
5. Remove `@flaky-check` when stable so it's excluded from normal suites

### How We Mark the Outcome

- **Pass**: 10/10 green → proceed
- **Investigate**: any fail in 10 → fix and retest
- **Quarantine (temporary)**: If a fix isn't immediate, keep `@flaky-check` and open an issue (see template below). Do not add to smoke/regression until stable

## Preventing Flakes (Cypress-focused)

### Synchronization & Waiting

**Prefer positive assertions that naturally wait:**
```javascript
cy.findByTestId('save').click()
cy.findByRole('status').should('contain.text', 'Saved')
```

**Wait on network, not time:**
```javascript
cy.intercept('POST', '/api/orders').as('saveOrder')
cy.findByTestId('save').click()
cy.wait('@saveOrder').its('response.statusCode').should('eq', 200)
```

Avoid `cy.wait(<ms>)` unless absolutely necessary; if you must, pair with a deterministic condition.

### Selectors & DOM Stability

- Use DTIs (data-testid, data-cy); avoid brittle selectors (nth-child, text that changes)
- Don't assert on elements while they're animating; disable animations in test env or assert the final state

### Test Isolation & State

- Start from a known state (DB fixtures, API setup) per test
- Avoid cross-test coupling (no reliance on prior test artifacts)
- Clear storage/cookies between tests if the flow requires isolation

### Retries & Timeouts (use sparingly)

- Cypress retries assertions by default—design assertions to be eventually true
- If increasing timeouts, keep them local and justified (don't raise global defaults)

### Clocks & Time-based Logic

- Use `cy.clock()` / `cy.tick()` for debounce/polling flows to remove timing fluke

### External/3rd-party Calls

- Stub or intercept non-essential 3rd-party requests
- For iframes/maps, assert on our integration points, not vendor DOM internals

## Triage & Remediation Playbook

### 1. Confirm it's a flake
- Re-run via the detector for 10 iterations; gather logs, screenshots, videos

### 2. Localize the failure
- Add network intercepts and log when responses arrive
- Temporarily increase logging around the failing step

### 3. Stabilize
- Replace arbitrary waits with event-driven waits
- Introduce/adjust DTIs and rework selectors
- Ensure backend or fixture data is deterministic
- Disable transitions/animations in test env if applicable

### 4. Retest
- 10/10 green → remove `@flaky-check`
- Still flaky → open/append to issue; keep `@flaky-check` until resolved

### Root-cause Categories (for the ticket)
App race, slow API, selector instability, test state, time/clock, 3rd-party, infra.

## When to Block a Merge

- New or modified e2e tests must pass 10/10 detector runs
- Critical paths (checkout, payments, auth) should pass 50/50 before enabling in smoke/regression

## Examples (Good vs. Flaky)

### Good
```javascript
cy.intercept('GET', '/api/items*').as('items')
cy.findByRole('button', { name: /load items/i }).click()
cy.wait('@items').its('response.statusCode').should('eq', 200)
cy.findByRole('grid').should('contain.text', 'Panoramic Terrace')
```

### Flaky
```javascript
cy.findByText('Load Items').click()
cy.wait(1000) // assumes server responds in 1s
cy.get('.grid .row:nth-child(3) .col:nth-child(2)').should('contain', 'Panoramic Terrace')
```

## Quick Checklist (pre-merge)

- [ ] Uses DTIs for all targeted elements
- [ ] Intercepts and waits on the right requests
- [ ] No arbitrary `wait(ms)` (or strongly justified)
- [ ] Stable initial data/state
- [ ] Passes detector 10/10 (50/50 for critical flows)

## Flaky Test Issue Template

When creating an issue for a flaky test, use this template:

```markdown
## Flaky Test Report

**Test**: [Test name and file path]
**Tag**: @flaky-check
**Failure Rate**: X/10 or X/50
**Last Detected**: [Date]

### Symptoms
- [ ] Intermittent failures
- [ ] Timeout issues
- [ ] Race conditions
- [ ] Selector instability

### Root Cause Analysis
**Category**: [App race / Slow API / Selector instability / Test state / Time/clock / 3rd-party / Infra]

**Details**: [Describe what's causing the flakiness]

### Proposed Fix
[ ] Replace arbitrary waits with event-driven waits
[ ] Add/improve DTIs
[ ] Fix test isolation
[ ] Stub external dependencies
[ ] Adjust timeouts
[ ] Other: [describe]

### Test Results
- [ ] 10/10 passes locally
- [ ] 10/10 passes in CI
- [ ] Ready for smoke/regression (if critical path)

### Additional Notes
[Any other relevant information]
```

## CI/CD Integration

### Automated Detection
- Run flaky test detection on all PRs with `@flaky-check` tagged tests
- Block merges if flaky tests are detected
- Generate reports for test stability trends

### Manual Override Process
If a flaky test needs to be temporarily ignored:
1. Document the reason in the issue
2. Set a timeline for resolution
3. Add to monitoring dashboard
4. Regular follow-up reviews

## Best Practices Summary

1. **Design for stability**: Write tests that wait for conditions, not time
2. **Use reliable selectors**: Prefer data attributes over CSS selectors
3. **Isolate tests**: Each test should be independent
4. **Monitor continuously**: Regular flaky test detection runs
5. **Fix quickly**: Address flaky tests as high priority
6. **Document everything**: Keep detailed records of flaky test investigations

## Tools and Resources

- **Cypress Flaky Test Detector**: Automated detection tool
- **Test Analytics Dashboard**: Track flaky test trends
- **Slack Integration**: Notify team of new flaky tests
- **Issue Templates**: Standardized reporting format

---

*This documentation should be reviewed and updated regularly as our testing practices evolve.*

