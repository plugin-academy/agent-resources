# Publishers

Publisher files are the sole editable identity registry. Required fields:
`id`, `name`, `url`, `description`, `verification`. `repository` is optional.
All public links use canonical HTTPS URLs without credentials or fragments.

Use a domain controlled by the publisher. Maintain `unverified` until
maintainers have recorded domain-control evidence in a reviewed PR.
Ownership of a GitHub repository does not establish ownership of a domain.
The same publisher may curate multiple catalogs with different hosting.

Index maintainers are not automatically the authors of indexed plugins.
Do not overwrite native author, repository, or installation-source metadata.
