# Architecture

## System context

```mermaid
flowchart LR
    Engineer["Engineer or CI"] --> Runner["Playwright Test runner"]
    Runner --> UI["Next.js storefront :8000"]
    Runner --> StoreAPI["Medusa Store/Auth APIs :9000"]
    Runner --> AdminAPI["Medusa Admin API :9000"]
    UI --> StoreAPI
    StoreAPI --> DB[("PostgreSQL")]
    AdminAPI --> DB
    Runner --> Evidence["HTML report, traces, screenshots, video"]
```

Playwright exercises customer behavior through the storefront and uses APIs only when setup or verification is not the behavior under test. Admin access is limited to deleting synthetic customers.

## Automation layers

```mermaid
flowchart TB
    Specs["Business-focused specifications"] --> Fixtures["Composable fixtures"]
    Specs --> Models["Page and component models"]
    Fixtures --> Factories["Unique data factories"]
    Fixtures --> Client["Typed Medusa API client"]
    Models --> Storefront["Storefront UI"]
    Client --> APIs["Store, Auth, and Admin APIs"]
    Storefront --> Backend["Medusa backend"]
    APIs --> Backend
```

| Layer                   | Responsibility                                          |
| ----------------------- | ------------------------------------------------------- |
| `automation/tests`      | Business risk, assertions, tags, and suite organization |
| `automation/pages`      | Reusable interactions with meaningful pages             |
| `automation/components` | Shared UI components such as navigation                 |
| `automation/fixtures`   | On-demand setup, browser state, and teardown            |
| `automation/factories`  | Unique synthetic customers and prepared carts           |
| `automation/api`        | Typed Store, Auth, and Admin operations                 |
| `automation/config`     | Environment resolution without hardcoded secrets        |

## Test-data lifecycle

```mermaid
sequenceDiagram
    participant Test
    participant Fixture
    participant StoreAPI as Store/Auth API
    participant Browser
    participant AdminAPI as Admin API

    Test->>Fixture: Request preparedCart or registeredCustomer
    Fixture->>StoreAPI: Create isolated data
    Fixture->>Browser: Install cart cookie when needed
    Fixture-->>Test: Provide typed resource
    Test->>Browser: Exercise customer behavior
    Test-->>Fixture: Test completes or fails
    Fixture->>AdminAPI: Delete synthetic customer
```

Carts and completed orders are intentionally not deleted individually. CI gives each run a disposable PostgreSQL database; local environments can be periodically reset.

## Execution matrix

| Trigger      | Checks                                              |
| ------------ | --------------------------------------------------- |
| Pull request | Format, lint, TypeScript, API tests, Chromium smoke |
| Main push    | Full Chromium regression plus Firefox/WebKit smoke  |
| Nightly      | Full Chromium regression plus Firefox/WebKit smoke  |
| Local        | Full, tagged, focused, headed, or UI mode           |

CI provisions PostgreSQL, runs migrations and stable seed data, lets Medusa generate ephemeral API keys, masks them, starts both applications, and uploads evidence.
