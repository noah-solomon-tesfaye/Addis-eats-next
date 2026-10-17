# Addis Eats — Performance Optimization

## Test Environment

- Framework: Next.js 16.3.8
- Test route: `/menu`
- Test mode: Production build
- Audit tool: Chrome Lighthouse

## Lighthouse Results

| Category | Before | After |
|---|---:|---:|
| Performance | 72 | 87 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

The Performance score improved by 15 points.

## Baseline Observations

Before optimization, the following measurements were recorded:

- Time to first byte: 7 ms
- Element render delay: 240 ms
- Total DOM elements: 294
- DOM depth: 10

LCP, CLS, and INP were not captured in the available baseline results.

## Optimizations Implemented

### Images

- Replaced standard HTML image elements with `next/image` on the menu listing and dish detail pages.
- Added explicit image dimensions.
- Added responsive `sizes` attributes.
- Added meaningful alternative text.
- Prioritized only the first image in the menu listing.

### Fonts

- Configured Geist and Geist Mono using `next/font/google`.
- Specified the Latin subset.
- Enabled `display: "swap"`.

### Environment Configuration

- Added `.env.example` with a placeholder authentication secret.
- Updated `.gitignore` so `.env.local` remains ignored while `.env.example` can be committed.
- Kept the real authentication secret out of `.env.example`.

## Results After Optimization

The final Lighthouse audit reported:

| Category | Score |
|---|---:|
| Performance | 87 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

LCP, CLS, and INP were not captured in the available final results.

## Notes

The production build completed successfully after the image and font changes.

Both Lighthouse audits were performed on the `/menu` route. The Performance score increased from 72 to 87. Lighthouse scores can vary between runs, so the improvement should be interpreted as an observed result rather than a guaranteed outcome.
