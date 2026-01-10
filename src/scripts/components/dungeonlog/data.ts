import { load as parseYaml } from 'js-yaml'

export type DungeonlogEntry = {
  slug: string
  title: string
  date?: string
  content: string
  titleImage?: string
}

const dungeonlogAssets = import.meta.glob('/blog/dungeonlog/**/*.{png,jpg,jpeg,gif,webp,avif,svg}', {
  query: '?url',
  import: 'default',
  eager: true,
})

const dungeonlogAssetMap = new Map<string, string>()

for (const [filePath, url] of Object.entries(dungeonlogAssets)) {
  const normalizedPath = filePath.replace(/\\/g, '/')
  dungeonlogAssetMap.set(normalizedPath, url as string)
}

const dungeonlogFiles = import.meta.glob('/blog/dungeonlog/**/index.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const dungeonlogEntries: Record<string, DungeonlogEntry> = {}

for (const [filePath, rawContent] of Object.entries(dungeonlogFiles)) {
  const normalizedPath = filePath.replace(/\\/g, '/')
  const slug = normalizedPath.split('/dungeonlog/')[1]?.split('/')[0]

  if (!slug) {
    continue
  }

  const { data, content } = parseFrontMatter(rawContent as string)
  const title = parseTitle(data?.title, slug)
  const date = parseString(data?.date) ?? parseDateFromSlug(slug)
  const titleImage = parseString(data?.title_image)

  dungeonlogEntries[slug] = { slug, title, date, content, titleImage }
}

export function getAllDungeonlogs(): DungeonlogEntry[] {
  return Object.values(dungeonlogEntries).sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    if (a.date) return -1
    if (b.date) return 1
    return a.title.localeCompare(b.title)
  })
}

export function resolveDungeonlogAssetUrl(assetPath: string): string | undefined {
  const normalized = assetPath.replace(/\\/g, '/')
  const key = normalized.startsWith('/') ? normalized : `/${normalized}`
  return dungeonlogAssetMap.get(key)
}

type FrontMatter = {
  title?: unknown
  date?: unknown
  title_image?: unknown
}

function parseFrontMatter(raw: string): { data: FrontMatter; content: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)

  if (!match) {
    return { data: {}, content: raw }
  }

  const [, frontMatter, body] = match

  try {
    const data = parseYaml(frontMatter) as FrontMatter
    return { data: data ?? {}, content: body ?? '' }
  } catch (_err) {
    return { data: {}, content: body ?? '' }
  }
}

function parseTitle(value: unknown, fallback: string): string {
  const parsed = parseString(value)
  return parsed ?? fallback
}

function parseString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }
  return undefined
}

function parseDateFromSlug(slug: string): string | undefined {
  return /^\d{4}-\d{2}-\d{2}$/.test(slug) ? slug : undefined
}
