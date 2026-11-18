# Plugin Academy agent resources

This repository holds the publisher and catalog metadata for
[Plugin Academy](https://plugin.academy). Plugins stay with their publishers.

## Browse or use a catalog

- [DSH catalog](https://plugin.academy/catalogs/dsh/catalog.json): the list of
  indexes you can browse with [Plugin Academy for DeepSeek Harness](https://www.npmjs.com/package/@plugin-academy/dsh-plugin-academy).
- [Featured index](https://plugin.academy/dsh/featured/index.json): add this
  index directly in Harness if you don't use the catalog plugin.
- [Publisher and catalog directory](https://plugin.academy/directory.json):
  machine-readable metadata.

Adding an index does not install plugins. Review the publisher and plugin before
installing anything.

## Contribute

See the [contribution guide](CONTRIBUTING.md) to propose an index or correct
metadata, and the [catalog guide](docs/catalogs.md) for field definitions.
You can keep your index on your own HTTPS host.

Run the local checks with Node.js 22.18 or newer:

```sh
npm ci
npm run validate
npm test
npm run build
```
