# Infinite Inference: Fan Chen-Chieh's Thinking Laboratory

The source code of the personal research website of **Fan Chen-Chieh (范宸杰)**, an independent researcher working on human-AI collaboration, epistemic sovereignty, and cognitive safety.

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
| `index.html` | The home page |
| `work-with-me.html` | Work with me: availability and services page, linked from the home page |
| `research-log.html` | Research Log: a timeline of published outputs, linked from the home page |
| `styles.css` | Compiled stylesheet, rebuilt automatically by GitHub Actions. Do not edit it by hand |
| `src/input.css`, `tailwind.config.js` | Tailwind CSS source and configuration |
| `site.js` | Back-to-top button and footer year (formerly an inline script) |
| `consent.js` | Cookie consent. Google Analytics loads only after the visitor accepts |
| `_headers` | Security headers for Cloudflare |
| `.assetsignore` | Files kept in the repo but not published to the website |
| `favicon.svg`, `apple-touch-icon.png`, `og-image.png`, `og-image-log.png` | Site icons and social preview images (home page and Research Log) |
| `google403c2e7c9e0e1475.html` | Google Search Console verification. Do not delete it |
| `.github/workflows/tailwind.yml` | Rebuilds `styles.css` on every push to `main` that changes a page or the Tailwind source |
| `.github/workflows/csp-check.yml`, `scripts/check_csp.py` | Read-only check that the CSP hashes match the inline scripts |


## Content Security Policy

The site has no inline executable script. Everything that runs lives in same-origin files (`consent.js`, `site.js`), which `script-src 'self'` allows, so the CSP needs **no hashes**. Add new behaviour to `site.js` (or another same-origin `.js` file loaded with `<script src="…" defer>`), not to an inline `<script>`: an inline script would be blocked by the browser and fail the CI check below.

The JSON-LD block in `index.html` (`type="application/ld+json"`) is a data block that browsers do not execute, so it is not subject to `script-src`. Edit it freely when adding research; no CSP change is needed.

Any CSP change must be made in the meta tag of every page (`index.html`, `research-log.html`, `work-with-me.html`) and in `_headers` (Cloudflare). A new external resource (image, iframe, script, font) must be added to the allow-list in all four places.

### Automatic check

`scripts/check_csp.py` (run by `.github/workflows/csp-check.yml` on every push and pull request that touches a page, `_headers` or the script) fails if any page has an inline script whose SHA-256 hash is not in its CSP (so any new inline script), or if the hashes in `_headers` differ from those in a page. The failure message prints the hash. To run it locally: `python scripts/check_csp.py`.

JSON-LD is ignored by the check (`REQUIRE_JSONLD_HASH = False`).

## License

© Fan Chen-Chieh. All Rights Reserved.

The license above applies only to this repository's website source code (HTML/CSS/JS). Licensing for the research content itself (papers, notes, data) is stated on their respective DOI pages (e.g. CC BY-NC 4.0 on Zenodo).
