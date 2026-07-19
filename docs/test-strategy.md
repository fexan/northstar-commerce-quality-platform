# Test strategy

## Coverage

The suite protects catalogue, variants, cart state, authentication, Store APIs, checkout validation, payment, and order confirmation. It currently discovers 19 Chromium regression tests plus four smoke scenarios on Firefox and WebKit.

## Test types

- **UI:** customer-visible workflows and validation.
- **API:** product and cart contracts, state, and totals.
- **API-assisted UI:** API setup followed by focused browser verification.
- **Smoke:** storefront health, product details, cart persistence, and completed checkout.

## Isolation and reliability

- Fresh browser context per test.
- Unique UUID-based customer emails.
- Independently created carts.
- Customer cleanup in fixture teardown, including failures.
- No `waitForTimeout` calls.
- Assertions wait for meaningful UI or business state.
- Parallel execution where isolated data permits.

## Failure evidence

- HTML report for every run.
- Screenshot on failure.
- Trace retained on failure.
- Optional video for the demo workflow.
- Application logs uploaded for CI failures.

## Adding a test

1. Place the specification in the closest `automation/tests/ui` or `automation/tests/api` domain.
2. Reuse an existing fixture and model before creating a new abstraction.
3. Use unique data and include teardown for persistent records.
4. Give the test a business-readable name and add structured steps for substantial flows.
5. Add `@smoke` only when the scenario is fast, critical, and cross-browser safe; add `@api` to API contract tests.
6. Run the focused file, then `npm run test:regression`.
