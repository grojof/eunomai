---
name: eunomai-secure-coding
description: Universal secure-coding directives anchored to the OWASP Top 10 and CWE Top 25. Use proactively while writing or changing code that handles input, auth, data, secrets, files, network calls, or dependencies — to avoid injection, broken access control, crypto and auth failures, SSRF, and unsafe deserialization. Writing-time guidance; for a diff audit use /security-review, for runtime blocking see safe-controls.
---

# eunomai-secure-coding

**Proactive, writing-time** secure-coding guidance — the universal directives no professional disputes,
each anchored to a recognized standard ([OWASP Top 10](https://owasp.org/www-project-top-ten/), CWE). It does
**not** reinvent: for a **diff-level audit** use Claude Code's native `/security-review`; for **runtime**
blocking, that's `safe-controls` (the hooks). Three planes, no overlap.

## Start with design (OWASP A04 — Insecure Design)

Before writing, name the **trust boundaries**: where untrusted input enters, what data is sensitive, who is
allowed to do what. Most vulnerabilities are designed in. Validate and authorize **at the boundary**,
allowlist over denylist, and fail closed.

## The directives (OWASP Top 10, anchored)

- **A01 Broken Access Control** (CWE-284/639): enforce authorization **server-side on every request**; deny by
  default; never trust a client-supplied role/id. Check object ownership (no IDOR).
- **A02 Cryptographic Failures** (CWE-327/798): use vetted libraries and current algorithms (AES-GCM,
  Argon2/bcrypt/scrypt for passwords) — **never roll your own crypto**; TLS in transit; encrypt sensitive data
  at rest.
- **A03 Injection** (CWE-89/78/79/943): never assemble SQL/shell/HTML/LDAP/NoSQL from untrusted input by
  concatenation — use **parameterized queries / safe APIs / context-aware escaping**. No `eval` of untrusted
  data.
- **A04 Insecure Design**: threat-model first (above); add rate limits and resource bounds (CWE-400).
- **A05 Security Misconfiguration** (CWE-16): secure defaults; least privilege; disable debug/verbose errors in
  prod; don't leak stack traces or internal detail to users (CWE-209).
- **A06 Vulnerable & Outdated Components**: keep dependencies current and CVE-scanned — see
  `eunomai-dependency-upgrade`.
- **A07 Identification & Authentication Failures** (CWE-287): strong auth, MFA where possible; safe session
  handling (rotate on login, secure/HttpOnly cookies); generic auth-failure messages; rate-limit login.
- **A08 Software & Data Integrity Failures** (CWE-502): **never deserialize untrusted data** into objects;
  verify integrity/signatures of updates and artifacts; pin CI/build inputs.
- **A09 Security Logging & Monitoring Failures** (CWE-778): log security-relevant events (authn/z, failures) —
  but **never log secrets, tokens, or PII**.
- **A10 Server-Side Request Forgery** (CWE-918): when fetching a user-supplied URL, allowlist hosts/schemes;
  block internal/metadata addresses.

## Secrets (cross-cutting, CWE-798)

Never hardcode secrets; read from environment or a secret store; never commit, print, or log them. (Runtime
access to secret paths is also gated by `safe-controls`.)

## Hand off the audit

This skill is *proactive*. To **review a diff** for these issues, run **`/security-review`** — don't
re-implement a reviewer here.
