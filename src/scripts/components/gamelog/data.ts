export type GamelogEntry = {
  slug: string
  title: string
  date?: string
  content: string
}

const gamelogFiles = import.meta.glob('/blog/gamelog/**/index.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function extractFrontMatter(raw: string): { title?: string; date?: string; content: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!match) {
    return { content: raw }
  }

  const [, frontMatter, body] = match
  let title: string | undefined
  let date: string | undefined

  frontMatter.split('\n').forEach((line) => {
    const trimmed = line.trim()

    const titleMatch = trimmed.match(/^title:\s*(.+)$/i)
    if (titleMatch) {
      title = titleMatch[1].trim().replace(/^['"]|['"]$/g, '')
      return
    }

    const dateMatch = trimmed.match(/^date:\s*(.+)$/i)
    if (dateMatch) {
      date = dateMatch[1].trim().replace(/^['"]|['"]$/g, '')
    }
  })

  return { title, date, content: body ?? '' }
}

const gamelogEntries: Record<string, GamelogEntry> = {}

for (const [filePath, rawContent] of Object.entries(gamelogFiles)) {
  const normalizedPath = filePath.replace(/\\/g, '/')
  const slug = normalizedPath.split('/gamelog/')[1]?.split('/')[0]

  if (!slug) {
    continue
  }

  const { title: fmTitle, date, content } = extractFrontMatter(rawContent as string)
  const title =
    typeof fmTitle === 'string' && fmTitle.trim().length > 0 ? fmTitle.trim() : slug

  const parsedDate = typeof date === 'string' && date.trim().length > 0 ? date : undefined

  gamelogEntries[slug] = { slug, title, date: parsedDate, content }
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
