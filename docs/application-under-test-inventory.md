# Application-under-test inventory

Discovery date: 2026-07-19

## Runtime

- Medusa backend 2.17.2 at `http://localhost:9000`.
- Next.js starter storefront 1.0.3 at `http://localhost:8000`.
- Default storefront country route: `/dk`.
- PostgreSQL-backed local development environment; Redis falls back to Medusa's in-memory implementation.

## Confirmed storefront journeys

- Home page, catalogue, category navigation, product details, empty cart, and account entry routes render.
- Catalogue filtering exposes Size and Color options; sorting offers latest, price ascending, and price descending.
- Login and registration interfaces are included. Account dashboard routes include profile, addresses, orders, and order details.
- Checkout routes and components include shipping/billing address entry, delivery selection, payment selection, review, submission, and order confirmation.
- The current local backend supports immediate synthetic customer provisioning and login. The storefront also supports an email-verification-required response if backend policy changes.
- The seeded Manual Payment provider completes local test orders without an external payment service.

## Seeded commerce data

- Region: Europe, currency EUR, countries GB, DE, DK, SE, FR, ES, and IT.
- Products: Medusa T-Shirt, Sweatshirt, Sweatpants, and Shorts.
- Variants: sizes S-XL; the T-Shirt also has Black and White colors.
- Shipping: Standard Shipping and Express Shipping through the manual fulfillment provider, both seeded at EUR 10.
- Payment: Medusa's system/default test payment provider (`pp_system_default`), presented by the starter as a development test-payment method.
- The Store Products API is reachable with the configured publishable key and returns all four seeded products.

## Known limitations and adjusted assumptions

- Product pages initially show an unavailable add-to-cart state until the customer selects the required variant options. Selecting a valid size (and color where applicable) makes the in-stock variant purchasable; this is expected behavior, not an inventory failure.
- Product cards can arrive after the initial server-rendered page state. Tests should assert eventual product visibility rather than assuming products exist in the first DOM response.
- The root workspace contains `medusa-creds.txt`. It is excluded by the new root `.gitignore`; credentials must be migrated to environment variables before the repository is shared.
- Search is not present in the inspected starter. Version 1 should cover catalogue filtering and sorting instead of search unless search is added later.
- Redis and the local event bus are development fallbacks and are not production-like dependencies.
- Next.js reports image-quality/LCP warnings and detects multiple lockfiles. These do not block functional automation but should be cleaned up during application stabilization.

## Safe Store API candidates

- Read products and variants through `/store/products`.
- Create and retrieve isolated carts through `/store/carts`.
- Add, update, and remove cart line items through cart endpoints.
- Create unique customers through Store authentication/customer endpoints; confirm cleanup behavior before relying on persistent customer creation in broad suites.

## Current implementation decisions

1. Keep automation under `automation/` and the application under `my-medusa-store/`.
2. Use page/component models only for substantial, reused business behavior.
3. Use Store/Auth APIs for isolated setup while retaining UI interactions for behavior under test.
4. Create customers and carts uniquely per test rather than sharing mutable state.

## Implemented through Milestone 5

- Catalogue, product variants, cart persistence, quantity changes, and removal.
- Typed product, cart, and customer Auth/Store API operations.
- Unique customer and isolated cart fixtures.
- Admin API teardown for customers created by authentication tests.
- Registration validation, invalid login, login, and logout.
- Shipping-address validation, delivery selection, Manual Payment, review, and order confirmation.
- Two deliberate API-assisted UI scenarios.

## Milestone 6 execution model

- Chromium runs the complete regression suite.
- Chromium, Firefox, and WebKit run scenarios tagged `@smoke`.
- Pull requests run static checks plus tagged API and Chromium smoke tests.
- Main, nightly, and manually dispatched workflows use a fresh PostgreSQL service and seeded ephemeral API keys.
- HTML reports are always uploaded; traces, screenshots, and application logs are uploaded on failure.
- Page-object actions use named `test.step` blocks so reports describe business behavior rather than locator mechanics.
