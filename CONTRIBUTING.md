# Contributing

Submit a pull request; no account system or submission API is needed.

1. Register a publisher under `publishers/` (community files may be nested).
   Supply the controlled domain identity, website, repository and attribution.
   Do not claim verification; provide domain-control evidence in the PR.
2. Add a catalog to the appropriate ecosystem discovery document. External
   HTTPS URLs are welcome; moving an independent publisher's repository is
   not required. Use `hosting: external` and `status: submitted` for a new
   independent collection. Use `curation: community` unless the publishing
   company owns every included plugin; those indexes may use
   `curation: official` with ownership provenance. `curation: academy` is
   reserved for collections curated by Plugin Academy.
3. Include provenance and native installation documentation. Catalog
   maintainers are not necessarily the authors of the resources they curate.
4. Run `npm ci && npm run validate && npm test && npm run build`.
5. A maintainer reviews identities, sources, URLs, installation instructions,
   unexpected executable downloads, ownership, and naming before merging.

Keep individual resource records sparse. Do not copy entire plugin manifests.
Do not change native Claude, Codex, MCP, or DSH packaging to fit this registry.
New ecosystems require a documented native distribution contract.

Report malicious resources privately through GitHub's private vulnerability
reporting if enabled. Otherwise contact maintainers through the organization
without publishing exploit payloads or credentials. Public issues can request
corrections, deprecation, or removal with non-sensitive evidence.
