# Demonstration guide

## Recorded checkout journey

[Watch the recorded Chromium checkout demo](assets/northstar-checkout-demo.webm). It uses synthetic customer and manual-payment data and was captured from the same tagged scenario used by the smoke suite.

## Repeatable demo

Start Medusa and the storefront, then run:

```bash
npm run demo:checkout
```

This runs the critical checkout journey headed, with one worker and video enabled. The video and test artifacts are written under `automation/test-results`.

## Suggested five-minute walkthrough

1. **Problem:** manual commerce regression is slow and inconsistent.
2. **Architecture:** show `docs/architecture.md` and explain UI/API separation.
3. **Isolation:** show `automation/fixtures/test.ts`, unique data, and teardown.
4. **Critical flow:** run `npm run demo:checkout` and highlight report steps.
5. **Evidence:** open `automation/playwright-report` and show cross-browser results.
6. **Delivery:** show the PR and main/nightly GitHub Actions workflows.

## Recording checklist

- Hide `.env`, credentials, terminal history, and unrelated browser tabs.
- Use synthetic customer and payment data only.
- Keep the recording under five minutes.
- Show one architecture decision, one passing flow, and one failure-evidence capability.
- Link the recording from the repository description or README when published.
