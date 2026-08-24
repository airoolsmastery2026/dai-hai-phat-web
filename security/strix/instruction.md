# DHP Strix Security Assessment Policy

You are performing an authorized defensive security assessment of the local Dai Hai Phat repository supplied as the target.

## Scope

- Analyze only the supplied local repository target.
- Do not discover, enumerate, scan, probe, or attack unrelated external hosts, domains, IP addresses, accounts, or third-party services.
- Treat external URLs found in source code as out of scope unless they are static documentation references needed to understand the code.

## Assessment behavior

- Prefer non-destructive validation.
- Do not alter production data, user data, credentials, cloud resources, DNS, deployments, or external services.
- Do not modify source files during the assessment.
- Never print, copy, or persist secrets beyond what is strictly necessary to identify that a secret exposure exists.
- Focus on application security defects, dependency/configuration risks, authentication/authorization issues, data exposure, injection risks, unsafe server actions, and deployment security relevant to this codebase.

## Output

- Record validated findings with severity, affected file/location, impact, evidence sufficient for defensive verification, and a remediation recommendation.
- Distinguish confirmed vulnerabilities from unverified hypotheses.
- Keep artifacts inside the normal local `strix_runs/` output directory.
