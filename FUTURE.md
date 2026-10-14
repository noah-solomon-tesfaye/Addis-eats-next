@'
# Future Improvements — Addis Eats

This file records improvements intentionally left outside the current capstone scope.

## Could Have

- Replace the in-memory demonstration authentication users with a persistent user database.
- Replace in-memory order storage with a persistent database.
- Add a production-ready customer registration and account management flow.
- Integrate a real payment provider.
- Replace illustrative delivery map coordinates with real delivery tracking.
- Add automated end-to-end tests for customer ordering and staff workflows.

## Before Production

- Review authentication, authorization, and order ownership.
- Configure and verify production environment variables.
- Test all protected routes and write operations against unauthorized access.
- Measure deployed performance and document the actual results in PERF.md.
- Verify empty, loading, and error states.

These items are future work, not claims that the features are already implemented.
'@ | Set-Content -Encoding utf8 .\FUTURE.md