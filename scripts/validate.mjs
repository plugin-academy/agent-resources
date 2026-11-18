import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import Ajv from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

export const root = new URL('../', import.meta.url)
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
ajv.addFormat('publisher-id', /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/)
ajv.addFormat('https-url', value => {
  if (!URL.canParse(value)) return false
  const url = new URL(value)
  return url.protocol === 'https:' && !url.username && !url.password && !url.href.includes('#')
})
for (const name of ['publisher', 'catalog', 'resource', 'discovery']) {
  ajv.addSchema(JSON.parse(await readFile(new URL(`schemas/${name}.schema.json`, root), 'utf8')))
}

export function validateRecord(type, value, path = type) {
  const validate = ajv.getSchema(`https://plugin.academy/schemas/${type}.schema.json`)
  if (!validate(value)) throw new Error(`${path}: ${ajv.errorsText(validate.errors, { separator: '; ' })}`)
}

async function jsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const result = []
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory)
    if (entry.isDirectory()) result.push(...await jsonFiles(url))
    else if (entry.name.endsWith('.json')) result.push(url)
  }
  return result
}

export async function loadDirectory(base = root) {
  const read = async url => JSON.parse(await readFile(url, 'utf8'))
  const publishers = await Promise.all((await jsonFiles(new URL('publishers/', base))).map(read))
  const discoveries = await Promise.all((await jsonFiles(new URL('catalogs/', base))).map(read))
  const resources = await Promise.all((await jsonFiles(new URL('resources/', base))).map(read))
  const data = { schemaVersion: 1, publishers, discoveries, catalogs: discoveries.flatMap(doc => doc.catalogs ?? []), resources }
  validateDirectory(data)
  return data
}

export function validateDirectory(data) {
  const unique = (values, name) => {
    if (new Set(values).size !== values.length) throw new Error(`Duplicate ${name}.`)
  }
  data.publishers.forEach(value => validateRecord('publisher', value))
  data.discoveries.forEach(value => validateRecord('discovery', value))
  data.resources.forEach(value => validateRecord('resource', value))
  unique(data.publishers.map(value => value.id), 'publisher identity')
  unique(data.catalogs.map(value => new URL(value.id).href), 'catalog identity')
  unique(data.catalogs.map(value => new URL(value.url).href), 'distribution URL')
  unique(data.resources.map(value => value.id), 'resource identity')
  const publishers = new Set(data.publishers.map(value => value.id))
  for (const value of [...data.discoveries, ...data.catalogs, ...data.resources]) {
    if (!publishers.has(value.publisher)) throw new Error(`Unknown publisher ${value.publisher}.`)
  }
  const global = data.discoveries.filter(value => value.ecosystems)
  if (global.length !== 1) throw new Error('Exactly one global discovery document is required.')
  const ecosystemDocs = data.discoveries.filter(value => value.ecosystem)
  unique(ecosystemDocs.map(value => value.ecosystem), 'ecosystem discovery document')
  unique(global[0].ecosystems.map(value => value.ecosystem), 'ecosystem pointer')
  for (const pointer of global[0].ecosystems) {
    if (!ecosystemDocs.some(doc => doc.ecosystem === pointer.ecosystem)) throw new Error(`Missing ${pointer.ecosystem} discovery document.`)
    if (pointer.url !== `https://plugin.academy/catalogs/${pointer.ecosystem}/catalog.json`) throw new Error('Discovery pointer must use its stable public URL.')
  }
  for (const doc of ecosystemDocs) {
    if (!global[0].ecosystems.some(pointer => pointer.ecosystem === doc.ecosystem)) throw new Error(`Missing global pointer for ${doc.ecosystem}.`)
    for (const catalog of doc.catalogs) {
      if (catalog.ecosystem !== doc.ecosystem) throw new Error(`Catalog ${catalog.id} is in the wrong ecosystem.`)
      if (catalog.curation === 'academy' && catalog.publisher !== 'plugin.academy') throw new Error('Academy catalogs must be maintained by Plugin Academy.')
      const names = catalog.pluginAcademy.resourceNames
      if (names && catalog.pluginCount !== names.length) throw new Error(`Resource count mismatch for ${catalog.id}.`)
    }
  }
  for (const resource of data.resources) {
    if (!resource.id.startsWith(`urn:air:${resource.publisher}:`)) throw new Error(`Resource identity must preserve publisher ${resource.publisher}.`)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const data = await loadDirectory()
  console.log(`Validated ${data.publishers.length} publishers, ${data.catalogs.length} catalogs, ${data.resources.length} resources.`)
}
