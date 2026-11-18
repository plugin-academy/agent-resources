import assert from 'node:assert/strict'
import { test } from 'node:test'
import { loadDirectory, validateDirectory, validateRecord } from '../scripts/validate.mjs'
import { updateCatalog } from '../scripts/sync-dsh.mjs'

const data = await loadDirectory()
const featured = data.catalogs.find(catalog => catalog.id === 'https://plugin.academy/catalogs/dsh/featured')

test('canonical identities and ecosystem pointers resolve', () => {
  assert.ok(data.publishers.some(publisher => publisher.id === featured.publisher))
  assert.equal(featured.pluginCount, 1)
  assert.doesNotThrow(() => validateDirectory(data))
})
test('the Featured collection lists dsh-context as its only plugin', () => {
  assert.deepEqual(featured?.pluginAcademy.resourceNames, ['dsh-context'])
})
test('Awesome DSH Plugin immediately follows the Plugin Academy collection', () => {
  const doc = data.discoveries.find(value => value.ecosystem === 'dsh')
  assert.deepEqual(doc.catalogs.slice(0, 2).map(catalog => catalog.url), [
    featured.url, 'https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json',
  ])
})
test('community DSH catalogs preserve external distribution and publisher attribution', () => {
  for (const [url, publisher] of [
    ['https://dshseek.com/market/dsh-index.json', 'dshseek.com'],
    ['https://cdn.dsh.so/market/index.json', 'dsh.so'],
    ['https://cdn.dsh.so/market/top-rank.json', 'dsh.so'],
    ['https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json', 'awesome-dsh-plugin.com'],
  ]) {
    const catalog = data.catalogs.find(value => value.url === url)
    assert.ok(catalog, `Missing community index ${url}`)
    assert.equal(catalog.publisher, publisher)
    assert.equal(catalog.ecosystem, 'dsh')
    assert.equal(catalog.curation, 'community')
    assert.ok(catalog.pluginCount > 0)
    assert.deepEqual(catalog.pluginAcademy, { hosting: 'external', status: 'submitted' })
    assert.equal(data.publishers.find(value => value.id === publisher)?.verification, 'unverified')
  }
})
test('schemas reject invalid identity, transport, date, and unknown fields', () => {
  for (const patch of [
    { publisher: 'Plugin Academy' }, { url: 'http://example.com/index.json' },
    { updatedAt: '2026-99-99T00:00:00Z' }, { curation: 'trusted' }, { extra: true },
  ]) assert.throws(() => validateRecord('catalog', { ...data.catalogs[0], ...patch }))
})
test('rejects blank display text and tags that would change when trimmed', () => {
  for (const patch of [
    { name: ' ' }, { description: '\t' }, { tags: [' '] }, { tags: ['context', ' context '] },
    { tags: ['context\n'] },
  ]) assert.throws(() => validateRecord('catalog', { ...featured, ...patch }), /must match pattern/)
  assert.doesNotThrow(() => validateRecord('catalog', { ...featured, tags: ['ai', 'developer tools'] }))
  assert.throws(() => validateRecord('publisher', { ...data.publishers[0], name: ' ' }), /must match pattern/)
})
test('requires a published index route only for Plugin Academy-hosted DSH catalogs', () => {
  const externalUrl = 'https://publisher.example/index.json'
  for (const url of [externalUrl, 'https://plugin.academy/dsh/index.json', `${featured.url}?version=1`]) {
    assert.throws(() => validateRecord('catalog', { ...featured, url }), /\/url must match pattern/)
  }
  assert.doesNotThrow(() => validateRecord('catalog', {
    ...featured, curation: 'community', url: 'https://plugin.academy/dsh/community/tools/index.json',
  }))
  assert.doesNotThrow(() => validateRecord('catalog', {
    ...featured, curation: 'community', url: externalUrl,
    pluginAcademy: { hosting: 'external', status: 'submitted' },
  }))
})
test('cross-record validation rejects duplicates, unknown publishers and incorrect counts', () => {
  for (const mutate of [
    value => value.publishers.push(value.publishers[0]),
    value => { value.catalogs[0].publisher = 'unknown.example' },
    value => { value.catalogs[0].pluginCount = 99 },
    value => { value.discoveries.find(doc => doc.ecosystem === 'dsh').catalogs[0].ecosystem = 'claude' },
  ]) {
    const value = structuredClone(data)
    mutate(value)
    assert.throws(() => validateDirectory(value))
  }
})
test('resource identity keeps the ARD publisher domain and provenance', () => {
  const value = structuredClone(data)
  value.resources = [{
    id: 'urn:air:plugin.academy:dsh:example', name: 'Example',
    publisher: 'plugin.academy', ecosystem: 'dsh', url: 'https://plugin.academy/example',
    provenance: 'https://github.com/plugin-academy/agent-resources',
  }]
  assert.doesNotThrow(() => validateDirectory(value))
  value.resources[0].id = 'urn:air:another.example:dsh:example'
  assert.throws(() => validateDirectory(value), /preserve publisher/)
})
test('publication handoff changes only membership, not every plugin release', () => {
  const doc = data.discoveries.find(value => value.ecosystem === 'dsh')
  const entry = {
    url: doc.catalogs[0].url, pluginCount: 1,
    resourceNames: [...doc.catalogs[0].pluginAcademy.resourceNames], updatedAt: '2026-11-17T00:00:00Z',
  }
  assert.deepEqual(updateCatalog(doc, { schemaVersion: 1, indexes: [entry] }), doc)
  entry.resourceNames = ['@example/replacement']
  const updated = updateCatalog(doc, { schemaVersion: 1, indexes: [entry] })
  assert.equal(updated.catalogs[0].updatedAt, entry.updatedAt)
  assert.deepEqual(updated.catalogs[0].pluginAcademy.resourceNames, entry.resourceNames)
  const external = doc.catalogs.filter(catalog => catalog.pluginAcademy.hosting === 'external')
  assert.deepEqual(updated.catalogs.filter(catalog => catalog.pluginAcademy.hosting === 'external'), external)
  for (const url of ['https://unknown.example/index.json', ...external.map(catalog => catalog.url)]) {
    assert.throws(() => updateCatalog(doc, {
      schemaVersion: 1, indexes: [{ ...entry, url }],
    }), /Unknown hosted index/)
  }
})
