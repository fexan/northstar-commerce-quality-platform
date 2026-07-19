# Design decisions

## Application-specific framework first

The solution models Northstar Commerce directly. Abstractions are introduced only where tests genuinely reuse behavior, avoiding a generic framework that obscures business intent.

## API-assisted setup

Products, carts, and customers are prepared through APIs when setup is not under test. UI registration, login, cart manipulation, and checkout remain browser-driven when those interactions are the behavior being validated.

## Fixtures own lifecycle

Fixtures keep setup and teardown together. Mutable customers and carts are test-scoped, receive unique data, and can run safely in parallel. Customer teardown uses a dedicated automation-only Admin API key.

## Assertions remain visible

Page objects contain reusable interactions and stable locators. Business assertions remain in specifications unless an assertion is part of completing an interaction, such as confirming navigation to the next checkout step.

## User-facing selectors

The preferred order is stable test IDs, accessible roles and labels, then scoped stable attributes. CSS chains, positional selectors, and arbitrary waits are avoided.

## Retry policy

Retries are disabled locally and limited to one in CI. A retry produces trace evidence and is treated as a signal to investigate, not a solution to instability.

## Cross-browser scope

Chromium runs the complete regression. Firefox and WebKit run only tagged critical paths to keep CI fast while still detecting browser-specific risk.

## Secrets and privileged access

Publishable keys may reach the storefront. Admin keys never use a `NEXT_PUBLIC_` variable and are used only from automation. CI keys and databases are ephemeral.
