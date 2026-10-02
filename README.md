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
| `research-log.html` | Research Log: a timeline of published outputs, linked from the home page |
| `styles.css` | Compiled stylesheet, rebuilt automatically by GitHub Actions. Do not edit it by hand |
| `src/input.css`, `tailwind.config.js` | Tailwind CSS source and configuration |
| `consent.js` | Cookie consent. Google Analytics loads only after the visitor accepts |
| `_headers` | Security headers for Cloudflare |
| `.assetsignore` | Files kept in the repo but not published to the website |
| `favicon.svg`, `apple-touch-icon.png`, `og-image.png`, `og-image-log.png` | Site icons and social preview images (home page and Research Log) |
| `google403c2e7c9e0e1475.html` | Google Search Console verification. Do not delete it |
| `.github/workflows/tailwind.yml` | Rebuilds `styles.css` on every push to `main` that changes a page or the Tailwind source |
| `.github/workflows/csp-check.yml`, `scripts/check_csp.py` | Read-only check that the CSP hashes match the inline scripts |


## Updating CSP hashes

The Content-Security-Policy allows two inline scripts by SHA-256 hash. If the text between the `<script>` tags changes, even by a single space, its hash changes and the browser blocks the script.

| If you change | Update the hash in |
|---|---|
| The JSON-LD block in `index.html` | `index.html` and `_headers` |
| The back-to-top and copyright-year script (identical in both pages) | `index.html`, `research-log.html` and `_headers` |

To recompute a hash, run this on the edited file and replace the old value:

```python
import re, hashlib, base64
html = open('index.html', encoding='utf-8').read()
for m in re.finditer(r'<script(?![^>]*\bsrc=)([^>]*)>(.*?)</script>', html, re.S):
    print(m.group(1).strip() or '(inline script)',
          'sha256-' + base64.b64encode(hashlib.sha256(m.group(2).encode('utf-8')).digest()).decode())
```

Browsers do not execute JSON-LD, so a stale JSON-LD hash will not break the page, but keep it in sync anyway.

### Automatic check

`scripts/check_csp.py` (run by `.github/workflows/csp-check.yml` on every push and pull request that touches a page, `_headers` or the script) recomputes every inline script's hash and fails if it is missing from that page's CSP, or if the `_headers` hashes differ from `index.html`. The failure message prints the expected hash to paste in. To run it locally: `python scripts/check_csp.py`.

The script requires a JSON-LD hash while `REQUIRE_JSONLD_HASH = True`; set it to `False` if the JSON-LD hash is ever dropped from the CSP.

## License

© Fan Chen-Chieh. All Rights Reserved.

The license above applies only to this repository's website source code (HTML/CSS/JS). Licensing for the research content itself (papers, notes, data) is stated on their respective DOI pages (e.g. CC BY-NC 4.0 on Zenodo).
