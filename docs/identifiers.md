# Identifiers

- Publisher: stable lowercase controlled FQDN, e.g. `plugin.academy`.
  Display names and GitHub usernames are not identity keys. A publisher can
  maintain catalogs in multiple repositories and ecosystems.
- Catalog: canonical HTTPS identity URL, separate from the `url` pointing to
  its current native distribution document. Preserve `id` when hosting moves.
- Optional resource: `urn:air:<publisher-domain>:<namespace>:<name>`.
  The publisher segment must match the registered publisher; preserve the
  original author's identity rather than relabeling curated work.

Resource schemas enforce a conservative subset of ARD-style naming, not a
complete RFC 8141 or ARD conformance check. Do not use display names, bare
`localhost`, installation URLs, or invented package URNs as permanent IDs.
