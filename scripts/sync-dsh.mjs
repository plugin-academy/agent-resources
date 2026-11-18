import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { loadDirectory, root, validateRecord } from './validate.mjs'

export function updateCatalog(doc, report) {
  if (report.schemaVersion !== 1 || !Array.isArray(report.indexes)) throw new Error('Invalid DSH publication report.')
  const next = structuredClone(doc)
  const urls = new Set()
  for (const entry of report.indexes) {
    if (urls.has(entry.url)) throw new Error(`Duplicate report URL ${entry.url}.`)
    urls.add(entry.url)
    const catalog = next.catalogs.find(value => value.url === entry.url)
    if (!catalog || catalog.pluginAcademy.hosting !== 'plugin-academy') throw new Error(`Unknown hosted index ${entry.url}.`)
    if (!Array.isArray(entry.resourceNames) || entry.resourceNames.some(name => typeof name !== 'string')) throw new Error('Missing resourceNames.')
    if (entry.pluginCount !== entry.resourceNames.length || new Set(entry.resourceNames).size !== entry.resourceNames.length) throw new Error('Invalid resource count.')
    const previous = [...(catalog.pluginAcademy.resourceNames ?? [])].sort()
    const names = [...entry.resourceNames].sort()
    if (catalog.pluginCount !== entry.pluginCount || JSON.stringify(previous) !== JSON.stringify(names)) {
      catalog.pluginCount = entry.pluginCount
      catalog.updatedAt = entry.updatedAt
      catalog.pluginAcademy.resourceNames = names
    }
    validateRecord('catalog', catalog)
  }
  return next
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.argv[2]) throw new Error('Usage: npm run sync:dsh -- /path/to/catalog-updates.json')
  await loadDirectory()
  const path = new URL('catalogs/dsh/catalog.json', root)
  const doc = JSON.parse(await readFile(path, 'utf8'))
  const report = JSON.parse(await readFile(process.argv[2], 'utf8'))
  const next = updateCatalog(doc, report)
  if (JSON.stringify(doc) !== JSON.stringify(next)) {
    await writeFile(path, JSON.stringify(next, null, 2) + '\n')
    console.log('Updated resource membership/counts. Review and submit a pull request.')
  } else console.log('No catalog metadata change required.')
}
