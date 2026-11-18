# ARD interoperability status

Reference: [Agentic Resource Discovery v0.91 proposal](https://github.com/ards-project/ard-spec/blob/f073b1ea9b01a5f068d0b0986426f2ea49fa30b2/spec/ard.md)
and its [URN naming guide](https://github.com/ards-project/ard-spec/blob/f073b1ea9b01a5f068d0b0986426f2ea49fa30b2/spec/urn-naming-guide.md),
reviewed 2026-11-16 at revision `f073b1ea9b01a5f068d0b0986426f2ea49fa30b2`.

We preserve domain-anchored publisher identity, separate identity from
location, and reserve ARD-style `urn:air:` names for optional resources.
Catalog URL identities are Plugin Academy registry identities, not ARD
resource identifiers.

**This release is not ARD compliant.** It does not publish an ARD
`ai-catalog.json`, perform DNS/cryptographic authority verification, implement
ARD search/federation, or run the upstream conformance suite. The DSH
discovery adapter is a separate protocol, not an ARD publisher catalog.
Full interoperability requires validating the then-current ARD entry/catalog
schemas, media types, authority rules and protocol behavior before making a
compliance claim. Do not expose a misleading `.well-known/ai-catalog.json`.
