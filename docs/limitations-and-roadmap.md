# Limitations and roadmap

## Current limitations

- The system under test is local/CI Medusa, not production.
- Checkout uses the seeded Manual Payment provider; no external payment processor is exercised.
- Search is absent from the current storefront, so filtering and sorting represent catalogue discovery.
- Carts and orders persist in a developer's local database; CI avoids accumulation with a fresh database per run.
- Customer cleanup requires `MEDUSA_ADMIN_API_KEY`.
- External product images depend on their remote host and can produce Next.js performance warnings.
- Visual regression, accessibility scanning, database assertions, and load testing are intentionally out of Version 1 scope.
- CI workflows are locally validated but become authoritative only after running in the repository's GitHub Actions environment.

## Recommended next work

1. Add accessibility checks to smoke journeys.
2. Add authenticated account/order-history coverage using API-created state.
3. Add schema validation for critical Store API responses.
4. Add a database reset command for local development.
5. Add visual snapshots only for stable, high-value components.
6. Publish trend data for duration and flake rate after sufficient CI history exists.
