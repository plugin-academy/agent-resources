import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { loadDirectory, root, validateRecord } from './validate.mjs'

const data = await loadDirectory()
const out = new URL('dist/', root)
await rm(out, { recursive: true, force: true })
async function write(path, value) {
  const url = new URL(path, out)
  await mkdir(new URL('./', url), { recursive: true })
  await writeFile(url, JSON.stringify(value, null, 2) + '\n')
}
for (const doc of data.discoveries) {
  if (!doc.ecosystem) {
    await write('catalogs/catalog.json', doc)
    continue
  }
  const published = doc.ecosystem === 'dsh' ? {
    ...doc,
    format: 1,
    sources: doc.catalogs.map(catalog => {
      const publisher = data.publishers.find(value => value.id === catalog.publisher)
      return {
        id: catalog.id, url: catalog.url, title: catalog.name, description: catalog.description,
        publisher: { id: publisher.id, name: publisher.name, url: publisher.url },
        pluginCount: catalog.pluginCount, updatedAt: catalog.updatedAt,
        tags: catalog.tags ?? [], curation: catalog.curation,
        pluginAcademy: catalog.pluginAcademy,
      }
    }),
  } : doc
  validateRecord('discovery', published)
  await write(`catalogs/${doc.ecosystem}/catalog.json`, published)
}
for (const publisher of data.publishers) await write(`publishers/${publisher.id}.json`, publisher)
await write('directory.json', data)
for (const name of ['publisher', 'catalog', 'resource', 'discovery']) {
  await write(`schemas/${name}.schema.json`, JSON.parse(await readFile(new URL(`schemas/${name}.schema.json`, root), 'utf8')))
}
await writeFile(new URL('_headers', out), '/*\n  Access-Control-Allow-Origin: *\n  Cache-Control: public, max-age=300\n  X-Content-Type-Options: nosniff\n/*.json\n  Content-Type: application/json; charset=utf-8\n')
console.log('Built static metadata in dist/. Publish independently at the origin root.')
