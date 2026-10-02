#!/usr/bin/env python3
"""Check that every inline <script> is allowed by the CSP SHA-256 hashes.

Reads every root-level page (*.html), plus _headers (read-only), and fails when:
  * an inline script's hash is missing from that page's meta CSP script-src
  * the _headers script-src hash set differs from any page's
Hashes in a CSP that match no inline script only produce a warning.

The site currently has no inline executable script (they live in consent.js and
site.js, allowed by script-src 'self'), so no hashes are expected anywhere; any
new inline <script> without a matching hash fails the check.

REQUIRE_JSONLD_HASH: JSON-LD (type="application/ld+json") is data that browsers
do not execute, so its hash gives no protection. Set to False to stop requiring
it (see README, "Updating CSP hashes"); the hash is then ignored everywhere.
"""
import base64
import hashlib
import re
import sys
from pathlib import Path

REQUIRE_JSONLD_HASH = False

ROOT = Path(__file__).resolve().parent.parent
# Every root-level page; new pages are picked up automatically. The Google Search
# Console verification file is not a site page and has no CSP.
PAGES = sorted(p.name for p in ROOT.glob("*.html") if not p.name.startswith("google"))
HEADERS = "_headers"

SCRIPT_RE = re.compile(r"<script(?![^>]*\bsrc=)([^>]*)>(.*?)</script>", re.S | re.I)
META_CSP_RE = re.compile(
    r'<meta\s+http-equiv="Content-Security-Policy"\s+content="(.*?)"', re.S | re.I
)
HASH_RE = re.compile(r"'(sha256-[A-Za-z0-9+/=]+)'")


def read(name):
    # newline=None folds CRLF/CR into LF, matching how browsers hash inline text
    with open(ROOT / name, encoding="utf-8", newline=None) as f:
        return f.read()


def script_src(csp):
    for directive in csp.split(";"):
        directive = directive.strip()
        if directive.startswith("script-src"):
            return directive
    return ""


def sha256_of(text):
    return "sha256-" + base64.b64encode(hashlib.sha256(text.encode("utf-8")).digest()).decode()


def is_jsonld(attrs):
    return "application/ld+json" in attrs.lower()


def main():
    errors, warnings = [], []
    page_hashes = {}

    for page in PAGES:
        html = read(page)
        m = META_CSP_RE.search(html)
        if not m:
            errors.append(f"{page}: no meta Content-Security-Policy found")
            continue
        allowed = set(HASH_RE.findall(script_src(m.group(1))))
        page_hashes[page] = allowed

        needed = set()
        for sm in SCRIPT_RE.finditer(html):
            attrs, body = sm.group(1).strip(), sm.group(2)
            kind = attrs or "(inline script)"
            if is_jsonld(attrs) and not REQUIRE_JSONLD_HASH:
                continue
            h = sha256_of(body)
            needed.add(h)
            if h not in allowed:
                errors.append(f"{page}: <script {kind}> hash not in CSP. Expected '{h}'")
        for h in sorted(allowed - needed):
            warnings.append(f"{page}: CSP hash matches no inline script: '{h}'")

    try:
        header_csp = re.search(r"Content-Security-Policy:\s*(.+)", read(HEADERS))
    except FileNotFoundError:
        header_csp = None
    if header_csp is None:
        errors.append(f"{HEADERS}: no Content-Security-Policy line found")
    else:
        header_hashes = set(HASH_RE.findall(script_src(header_csp.group(1))))
        for page, page_set in page_hashes.items():
            for h in sorted(page_set - header_hashes):
                errors.append(f"{HEADERS}: missing hash present in {page}: '{h}'")
            for h in sorted(header_hashes - page_set):
                errors.append(f"{HEADERS}: has hash not in {page}: '{h}'")

    for w in warnings:
        print(f"WARNING: {w}")
    for e in errors:
        print(f"ERROR: {e}")
    if errors:
        return 1
    print("CSP hash check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
