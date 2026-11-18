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
the DSH catalog format (`format: 1, sources: [...]`), with
`title`, publisher display metadata, required `pluginCount`, optional tags,
and update date. Tags must be nonblank, trimmed, and unique. Additional identity
and curation fields are forward-compatible.
The guide's illustrative `schemaVersion/indexes` shape is not the DSH wire
contract.

Catalog metadata owns identity, publisher, descriptive information, stable
distribution URL, count and membership summary. The native DSH repository
owns versions, authors, source repositories, and install targets.

`curation` describes responsibility, not a safety guarantee:

- `academy`: curated by Plugin Academy, including third-party plugins.
  Only the `plugin.academy` publisher may use this value.
- `community`: an independently curated collection.
- `official`: an index published by a company that owns every included plugin.
  Ownership provenance is reviewed by maintainers, not established by schema
  validation.

The discovery order is Academy collections, community indexes, then official
publisher-owned indexes. Hosting, review status, and publisher verification
remain independent of curation.

Release DSH plugin support for `academy` before publishing catalogs that use
it. Older plugin versions reject unknown curation values. Build the website
with matching canonical metadata so its sections and JSON agree.

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
`npm run sync:dsh -- ../dsh-plugin-academy/dist/catalog-updates.json`. This
updates hosted collection membership and counts, not plugin versions or
descriptions.

## Academy DSH indexes

| Index | Publisher | Plugin count snapshot (2026-11-18) |
| --- | --- | ---: |
| [Featured](https://plugin.academy/dsh/featured/index.json) | [Plugin Academy](https://plugin.academy) | 2 |

## Community DSH indexes

| Index | Publisher | Plugin count snapshot (2026-11-18) |
| --- | --- | ---: |
| [Awesome DSH Plugin](https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json) | [Awesome DSH Plugin](https://awesome-dsh-plugin.com) | 6,112 |
| [DSH.SO Plugin Market](https://cdn.dsh.so/market/index.json) | [DSH.SO](https://www.dsh.so) | 14,534 |
| [DSH.SO Curated Leaderboards](https://cdn.dsh.so/market/top-rank.json) | [DSH.SO](https://www.dsh.so) | 1,200 |

These are separate, independently hosted indexes registered with
`curation: community`, `hosting: external`, and `status: submitted`.
Their publisher identities remain unverified. Any upstream claims about
verification or security auditing belong to the publisher, not Plugin Academy.
Plugin counts are snapshots; the native indexes remain authoritative for
current membership and installation details. Hosted publication reports do not
update these external indexes.

## Official DSH indexes

| Index | Publisher | Plugin count snapshot (2026-11-18) |
| --- | --- | ---: |
| [Beings Labs](https://labs.beings.dev/dsh/index.json) | [Beings Labs](https://labs.beings.dev) | 2 |

These publisher-owned indexes use `curation: official`. Beings Labs is
externally hosted with `status: submitted` and an unverified publisher identity;
the official classification is an ownership claim, not a security review.
The plugin count is a snapshot, and the native index remains authoritative.
