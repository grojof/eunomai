---
name: eunomai-dependency-upgrade
description: Universal hygiene for adding or upgrading third-party dependencies — pin via lockfile, scan for known CVEs (SCA) before merging, read the changelog, take breaking changes incrementally, run the tests, and track licenses. Use when adding a new dependency, bumping versions, or responding to a security advisory. Anchored to OWASP A03:2025 (Software Supply Chain) and SLSA.
---

# eunomai-dependency-upgrade

Open-source makes up the majority of modern codebases, so dependencies are a primary risk surface. This is
the universal hygiene for changing them — anchored to
[OWASP A03:2025 Software-Supply-Chain Failures](https://owasp.org/Top10/2025/A03_2025-Software_Supply_Chain_Failures/)
and [SLSA](https://slsa.dev/). It does not replace your package manager — it's the checklist around it.

## Before adding a new dependency

- **Do you need it?** Prefer the standard library or a few lines over a dependency. Fewer deps = smaller
  attack surface.
- **Vet it:** maintained (recent commits/releases), reputable author, healthy usage, and an **acceptable
  license** for your project.
- **Check it's clean:** run an **SCA / CVE scan** (e.g. `npm audit`, `osv-scanner`, `pip-audit`) before
  committing it.

## When upgrading

1. **Pin via a lockfile** and commit it — deliberate, reproducible versions; upgrade on purpose, not by drift.
2. **Read the changelog / release notes.** Note breaking changes and deprecations.
3. **One major at a time.** Don't jump several majors at once; upgrade, build, test, repeat.
4. **Scan again (SCA).** Confirm the new version (and its **transitive** deps) has no known critical/high CVE;
   if one exists, check exploitability before shipping.
5. **Run the full test suite.** Treat a dependency upgrade like any other change — green tests before merge.
6. **Track licenses.** Record/respect the dependency's license (an SBOM — SPDX/CycloneDX — captures name,
   version, supplier, and license); a new dep must not introduce an incompatible license.

## Responding to a security advisory

When a CVE is published for a dependency you use: identify affected versions, upgrade to the patched release
(or apply the documented mitigation), scan, test, and ship. An up-to-date lockfile + SBOM makes "are we
affected?" a lookup, not an investigation.

## Boundary

Universal hygiene only — the *policy* (which CVE severity blocks a release, approved registries, SLSA level)
is the project/org's call, declared in its **rules**, not here.
