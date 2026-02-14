const IMAGE_SRC_PATTERN = /<img[^>]+src=["']([^"']+)["']/i

export const getFirstImageFromHtml = html => {
  if (!html) return null
  const match = html.match(IMAGE_SRC_PATTERN)
  return match ? match[1] : null
}

export const normalizeSearchQuery = query => (query || "").trim().toLowerCase()

export const matchesPostQuery = (post, query) => {
  const normalized = normalizeSearchQuery(query)
  if (!normalized) return false

  const title = post.frontmatter.title?.toLowerCase() || ""
  const description = post.frontmatter.description?.toLowerCase() || ""
  const excerpt = post.excerpt?.toLowerCase() || ""
  const tags = post.frontmatter.tags?.join(" ").toLowerCase() || ""

  return (
    title.includes(normalized) ||
    description.includes(normalized) ||
    excerpt.includes(normalized) ||
    tags.includes(normalized)
  )
}

export const getReadingTimeText = timeToRead => `${Math.max(1, timeToRead || 0)} min read`
