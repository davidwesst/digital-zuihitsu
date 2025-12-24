import { load as parseYaml } from 'js-yaml'

export type PlayData = {
  started_on?: string
  completed_on?: string
  platform?: string
}

export type Rating = {
  gameplay?: number
  narrative?: number
  style?: number
  sound?: number
  overall?: number
}

export type GamelogEntry = {
  slug: string
  title: string
  date?: string
  content: string
  playData?: PlayData
  rating?: Rating
}

const gamelogFiles = import.meta.glob('/blog/gamelog/**/index.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const gamelogEntries: Record<string, GamelogEntry> = {}

for (const [filePath, rawContent] of Object.entries(gamelogFiles)) {
  const normalizedPath = filePath.replace(/\\/g, '/')
  const slug = normalizedPath.split('/gamelog/')[1]?.split('/')[0]

  if (!slug) {
    continue
  }

  const { data, content } = parseFrontMatter(rawContent as string)
  const title = parseTitle(data?.title, slug)
  const parsedDate = parseString(data?.date)
  const playData = parsePlayData(data?.play_data)
  const rating = parseRating(data?.rating)

  gamelogEntries[slug] = { slug, title, date: parsedDate, content, playData, rating }
}

export function getAllGamelogs(): GamelogEntry[] {
  return Object.values(gamelogEntries).sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    if (a.date) return -1
    if (b.date) return 1
    return a.title.localeCompare(b.title)
  })
}

export function getGamelog(slug: string): GamelogEntry | undefined {
  return gamelogEntries[slug]
}

type FrontMatter = {
  title?: unknown
  date?: unknown
  play_data?: unknown
  rating?: unknown
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

function parsePlayData(raw: unknown): PlayData | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const record = raw as Record<string, unknown>
  const playData: PlayData = {
    started_on: parseString(record.started_on),
    completed_on: parseString(record.completed_on),
    platform: parseString(record.platform),
  }

  return Object.values(playData).some(Boolean) ? playData : undefined
}

function parseNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const num = Number(value)
    return Number.isFinite(num) ? num : undefined
  }
  return undefined
}

function parseRating(raw: unknown): Rating | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const record = raw as Record<string, unknown>
  const rating: Rating = {
    gameplay: parseNumber(record.gameplay),
    narrative: parseNumber(record.narrative),
    style: parseNumber(record.style),
    sound: parseNumber(record.sound),
    overall: parseNumber(record.overall),
  }

  return Object.values(rating).some((value) => value !== undefined) ? rating : undefined
}
