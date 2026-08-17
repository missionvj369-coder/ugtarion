# Contributing to Universal Guard Trust

Thank you for contributing to Universal Guard Trust.

UGTarion is part of the technical ecosystem supporting Universal Guard Trust's work in human evolution, integrated intelligence, human flourishing, conscious civilization and collaborative creation.

## Before You Contribute

Please understand the project and its purpose before making changes.

Start with:

* `README.md`
* `PROFESSIONAL_BUILD_GUIDE.md`
* `STABILITY_SECURITY_CHECKLIST.md`
* `DEPLOYMENT.md`

For architectural changes, inspect the existing implementation before introducing new patterns.

## What We Welcome

Contributions may include:

* bug fixes
* security improvements
* performance improvements
* accessibility improvements
* documentation
* tests
* developer tooling
* AI-assisted systems
* knowledge infrastructure
* project architecture
* reusable open-source components

## Before Opening a Pull Request

Please:

1. Understand the problem being solved.
2. Keep the change focused.
3. Avoid unnecessary rewrites.
4. Run the relevant tests.
5. Run the production build when appropriate.
6. Check TypeScript for errors.
7. Do not commit credentials, secrets or private data.
8. Document important architectural changes.
9. Explain known limitations.

## Development Checks

Where supported:

```bash
npm ci
npm run build
npx tsc --noEmit
npm audit
```

Run the project's relevant test scripts before submitting changes.

## Security

Never commit:

* API keys
* passwords
* tokens
* service-role credentials
* private keys
* `.env` files containing secrets

If you discover a security vulnerability, do not publish sensitive details in a public issue.

Use the security reporting process described in `SECURITY.md`.

## Pull Requests

A good pull request should explain:

### Problem

What problem does this change solve?

### Approach

How does the implementation solve it?

### Testing

What was tested?

### Risks

Could this change affect authentication, security, data integrity, deployment or performance?

### Follow-up

What remains to be done?

## Code Standards

Prefer:

* clear code
* small focused changes
* explicit naming
* reusable components
* typed interfaces
* defensive error handling
* accessible interfaces
* secure defaults

Avoid:

* unnecessary dependencies
* duplicated architecture
* hidden side effects
* hard-coded secrets
* unexplained magic values
* large unrelated refactors

## AI-Assisted Contributions

AI tools may be used to assist development.

However, contributors remain responsible for the code they submit.

AI-generated code must be:

* reviewed by a human
* tested
* understood sufficiently to maintain
* checked for security implications
* checked for licensing concerns where relevant

Do not assume AI-generated output is correct.

## Architectural Changes

For changes affecting:

* authentication
* Supabase
* security
* deployment
* database schema
* public APIs
* AI infrastructure

explain the architectural reason in the pull request.

## Community

Contributions should improve the ability of people to understand, create, test, share and learn.

Be respectful.

Disagree with ideas without attacking people.

## License

The licensing terms for this repository are defined by the repository's selected license.

Do not assume that all UGT projects use the same license.

---

**Universal Guard Trust**

https://www.ugtglobal.space/
