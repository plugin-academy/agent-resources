# Catalogs and discovery

`catalog.schema.json` describes a publisher-maintained collection. A
`discovery.schema.json` document is a registry listing those collections, not a
plugin index or an ARD publisher catalog.

Schemas use JSON Schema draft 2020-12. The `publisher-id` (lowercase FQDN)
and `https-url` (HTTPS, no credentials or fragment) formats are implemented in
`scripts/validate.mjs`; consumers reusing the schemas must register these
formats as well as standard date-time validation.

Canonical ecosystem documents live under `catalogs/<ecosystem>/catalog.json`.
The build produces their public copies. For DSH it also generates
`format: 1, sources: [...]`, the Plugin Indexes contract, with
`title`, publisher display metadata, required `pluginCount`, optional tags,
and update date. Tags must be nonblank, trimmed, and unique. Additional identity
and curation fields are forward-compatible.
The guide's illustrative `schemaVersion/indexes` shape is not the DSH wire
contract.

Catalog metadata owns identity, publisher, descriptive information, stable
distribution URL, count and membership summary. The native DSH repository
owns versions, authors, source repositories, and install targets.

`pluginAcademy` is an explicitly namespaced extension:

- `hosting`: `plugin-academy` or `external`, independent of curation.
  Plugin Academy-hosted DSH indexes use
  `https://plugin.academy/dsh/<slug>/index.json` or
  `https://plugin.academy/dsh/community/<slug>/index.json`.
- `status`: structural/review/editorial lifecycle, never a safety guarantee.
- `resourceNames`: optional membership-only handoff for hosted collections,
  not copied plugin records. When supplied, the website checks membership
  against the native index before packaging it.

Community-hosted indexes and external catalogs are supported through the same
schema. Claude and Codex start empty; no placeholder native manifests or
fictional plugins are published.

Maintainers can apply a reviewed DSH publication report with
`npm run sync:dsh -- ../dsh-plugin-indexes/dist/catalog-updates.json`. This
updates hosted collection membership and counts, not plugin versions or
descriptions.
