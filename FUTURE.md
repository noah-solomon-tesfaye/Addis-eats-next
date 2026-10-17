# Future Improvements — Addis Eats

This file records improvements intentionally left outside the current capstone scope.

- Replace hardcoded demo accounts with a persistent user store and secure account management.
- Move order storage from the local JSON file to a production database.
- Measure deployed performance and document the actual results in PERF.md.
- Verify empty, loading, and error states across the main customer and staff flows.
- Test authentication, authorization, and redirect handling against common security attacks.
- Review accessibility and responsive behavior on a real mobile device.

These items are future work, not claims that the features are already implemented.
'@ | Set-Content -Encoding utf8 .\FUTURE.md