---
name: eunomai-secure-coding
description: Universal secure-coding directives anchored to the OWASP Top 10:2025 and CWE Top 25. Use proactively while writing or changing code that handles input, auth, data, secrets, files, network calls, or dependencies — to avoid injection, broken access control, crypto and auth failures, SSRF, and unsafe deserialization. Writing-time guidance; for a diff audit use /security-review, for runtime blocking see safe-controls.
---

# eunomai-secure-coding

**Proactive, writing-time** secure-coding guidance — the universal directives no professional disputes,
each anchored to a recognized standard ([OWASP Top 10:2025](https://owasp.org/Top10/2025/), CWE). It does
**not** reinvent: for a **diff-level audit** use Claude Code's native `/security-review`; for **runtime**
blocking, that's `safe-controls` (the hooks). Three planes, no overlap.

## Start with design (A06:2025 Insecure Design)

Before writing, name the **trust boundaries**: where untrusted input enters, what data is sensitive, who is
allowed to do what. Most vulnerabilities are designed in. Validate and authorize **at the boundary**,
allowlist over denylist, and fail closed. When a trust-boundary decision is **non-obvious**, suggest
capturing it where the project keeps decisions (an ADR or docs note) — it is knowledge the next change
needs; don't block if declined.

## The directives (OWASP Top 10:2025, anchored)

- **A01:2025 Broken Access Control** (CWE-284/639): enforce authorization **server-side on every request**;
  deny by default; never trust a client-supplied role/id. Check object ownership (no IDOR). SSRF (CWE-918)
  is folded in here since 2025: when fetching a user-supplied URL, allowlist hosts/schemes; block
  internal/metadata addresses.
- **A02:2025 Security Misconfiguration** (CWE-16): secure defaults; least privilege; disable debug/verbose
  errors in prod.
- **A03:2025 Software Supply Chain Failures**: keep dependencies current and CVE-scanned — see
  `eunomai-dependency-upgrade` (same anchor).
- **A04:2025 Cryptographic Failures** (CWE-327/798): use vetted libraries and current algorithms (AES-GCM,
  Argon2/bcrypt/scrypt for passwords) — **never roll your own crypto**; TLS in transit; encrypt sensitive data
  at rest.
- **A05:2025 Injection** (CWE-89/78/79/943): never assemble SQL/shell/HTML/LDAP/NoSQL from untrusted input by
  concatenation — use **parameterized queries / safe APIs / context-aware escaping**. No `eval` of untrusted
  data.
- **A06:2025 Insecure Design**: threat-model first (above); add rate limits and resource bounds (CWE-400).
- **A07:2025 Authentication Failures** (CWE-287): strong auth, MFA where possible; safe session handling
  (rotate on login, secure/HttpOnly cookies); generic auth-failure messages; rate-limit login.
- **A08:2025 Software or Data Integrity Failures** (CWE-502): **never deserialize untrusted data** into
  objects; verify integrity/signatures of updates and artifacts; pin CI/build inputs.
- **A09:2025 Security Logging & Alerting Failures** (CWE-778): log security-relevant events (authn/z,
  failures) — but **never log secrets, tokens, or PII**.
- **A10:2025 Mishandling of Exceptional Conditions** (CWE-209): handle errors explicitly and **fail closed**;
  don't leak stack traces or internal detail to users.

## Secrets (cross-cutting, CWE-798)

Never hardcode secrets; read from environment or a secret store; never commit, print, or log them. (Runtime
access to secret paths is also gated by `safe-controls`.)

## Hand off the audit

This skill is *proactive*. To **review a diff** for these issues, run **`/security-review`** — don't
re-implement a reviewer here.

## Boundary

Universal floor only — org/project security rules, declared in the project's **rules**, take precedence
where stricter; this skill never relaxes them.
