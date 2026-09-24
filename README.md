# Infinite Inference: Fan Chen-chieh's Thinking Laboratory

The source code of the personal research website of **Fan Chen-chieh (范宸杰)**, an independent researcher working on human-AI collaboration, epistemic sovereignty, and cognitive safety.

- **Website:** https://loveapplefanfan-png.github.io/AI_Cooperation_Essays/
- **ORCID:** https://orcid.org/0009-0000-5317-7385

## Main research

**DCM 2.0: Deep Collaboration Methodology 2.0** (2026) is a street-intercept mixed-methods study on AI responsibility attribution and epistemic sovereignty. It draws on 328 valid interviews across 33 nationalities, conducted at Da'an Forest Park, Taipei.

- Full study: https://doi.org/10.5281/zenodo.20280700
- Working paper (SSRN): https://ssrn.com/abstract=7317858
- Field & Technical Notes: https://doi.org/10.5281/zenodo.20281517

The full list of outputs is on the website.

## Repository structure

| Path | Purpose |
|---|---|
| `index.html` | The single-page website |
| `styles.css` | Compiled stylesheet, rebuilt automatically by GitHub Actions. Do not edit it by hand |
| `src/input.css`, `tailwind.config.js` | Tailwind CSS source and configuration |
| `consent.js` | Cookie consent. Google Analytics loads only after the visitor accepts |
| `_headers` | Security headers for Cloudflare |
| `.assetsignore` | Files kept in the repo but not published to the website |
| `favicon.svg`, `apple-touch-icon.png`, `og-image.png` | Site icons and social preview image |
| `google403c2e7c9e0e1475.html` | Google Search Console verification. Do not delete it |
| `.github/workflows/tailwind.yml` | Rebuilds `styles.css` on every push to `main` |

When you change an inline `<script>` in `index.html`, recompute its SHA-256 hash. Then update the hash in both the Content-Security-Policy `<meta>` tag and `_headers`. Otherwise the browser blocks the script.

## License

© Fan Chen-chieh. All Rights Reserved.
