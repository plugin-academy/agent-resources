# Governance

Plugin Academy maintainers manage registry inclusion, removals,
publisher verification, and schema releases. Community members may propose
publishers, catalogs, corrections, and plugin additions through pull requests.
Independent publishers retain their ownership and provenance.

Hosting is not endorsement. `academy` means curated by Plugin Academy;
`community` means an independently curated collection. `official` is reserved
for an index published by a company that owns every plugin in that index.
Maintainers review ownership provenance before accepting that classification.
Publisher verification describes identity review, not executable safety.

Statuses are distinct: `submitted` awaits review; `validated` means automated
structural checks passed; `verified` records maintainer review; `featured`
means editorial selection; `deprecated` means no longer recommended.
Only maintainers may assign verified/featured status, with evidence in the PR.
The initial publisher is deliberately unverified; no domain-control claim has
been made by the local build.

CI is structural validation, never a security review. Maintainers may
deprecate/remove harmful entries promptly, record the reason, and accept
appeals through GitHub issues. Native executable sources remain the original
publishers' responsibility.
