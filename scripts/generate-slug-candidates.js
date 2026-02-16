const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

const ROOT_DIR = process.cwd()
const BLOG_ROOT = path.join(ROOT_DIR, "content", "blog")
const OUTPUT_CSV = path.join(ROOT_DIR, "slug-migration.csv")
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const walkMarkdownFiles = dir => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap(entry => {
    const target = path.join(dir, entry.name)
    if (entry.isDirectory()) return walkMarkdownFiles(target)
    if (entry.isFile() && entry.name === "index.md") return [target]
    return []
  })
}

const parseFrontmatter = text => {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return null

  const frontmatterText = match[1]
  const slugMatch = frontmatterText.match(/^slug:\s*['"]?([^'"\n]+)['"]?\s*$/m)
  const dateMatch = frontmatterText.match(/^date:\s*['"]?([^'"\n]+)['"]?\s*$/m)

  return {
    raw: frontmatterText,
    slug: slugMatch ? slugMatch[1].trim() : "",
    date: dateMatch ? dateMatch[1].trim() : "",
  }
}

const toLegacySlug = absoluteFilePath => {
  const relativeDir = path.dirname(path.relative(BLOG_ROOT, absoluteFilePath))
  const normalized = relativeDir.split(path.sep).join("/")
  return `/${normalized}/`
}

const getLeafSegment = legacySlug => {
  const parts = legacySlug.split("/").filter(Boolean)
  return parts[parts.length - 1] || ""
}

const normalizeAsciiSlug = value => {
  const normalized = (value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  if (!SLUG_PATTERN.test(normalized)) return ""
  if (!/[a-z]/.test(normalized)) return ""
  return normalized
}

const toDateKey = dateValue => {
  const digits = (dateValue || "").replace(/[^0-9]/g, "")
  if (digits.length >= 8) return digits.slice(0, 8)
  if (digits.length >= 6) return `${digits}01`
  return "undated"
}

const createFallbackSlug = (legacySlug, dateValue) => {
  const dateKey = toDateKey(dateValue)
  const hash = crypto.createHash("md5").update(legacySlug).digest("hex").slice(0, 6)
  return `post-${dateKey}-${hash}`
}

const ensureUnique = (baseSlug, usedSlugs) => {
  if (!usedSlugs.has(baseSlug)) return { slug: baseSlug, collision: false }

  let index = 2
  let next = `${baseSlug}-${index}`
  while (usedSlugs.has(next)) {
    index += 1
    next = `${baseSlug}-${index}`
  }

  return { slug: next, collision: true }
}

const csvEscape = value => {
  const safe = String(value ?? "").replace(/"/g, '""')
  return `"${safe}"`
}

const files = walkMarkdownFiles(BLOG_ROOT).sort()
const rows = []
const usedSlugs = new Set()

for (const filePath of files) {
  const text = fs.readFileSync(filePath, "utf8")
  const frontmatter = parseFrontmatter(text)

  if (!frontmatter) {
    rows.push({
      file: path.relative(ROOT_DIR, filePath).split(path.sep).join("/"),
      legacyPath: toLegacySlug(filePath),
      currentSlug: "",
      suggestedSlug: "",
      collisionFlag: "missing-frontmatter",
      source: "none",
    })
    continue
  }

  const legacyPath = toLegacySlug(filePath)
  const relativePath = path.relative(ROOT_DIR, filePath).split(path.sep).join("/")
  const currentSlug = frontmatter.slug

  if (currentSlug) {
    usedSlugs.add(currentSlug)
    rows.push({
      file: relativePath,
      legacyPath,
      currentSlug,
      suggestedSlug: currentSlug,
      collisionFlag: "false",
      source: "existing",
    })
    continue
  }

  const leaf = getLeafSegment(legacyPath)
  const asciiFromLeaf = normalizeAsciiSlug(leaf)
  const baseSlug = asciiFromLeaf || createFallbackSlug(legacyPath, frontmatter.date)
  const uniqueResult = ensureUnique(baseSlug, usedSlugs)

  usedSlugs.add(uniqueResult.slug)
  rows.push({
    file: relativePath,
    legacyPath,
    currentSlug: "",
    suggestedSlug: uniqueResult.slug,
    collisionFlag: String(uniqueResult.collision),
    source: asciiFromLeaf ? "path-leaf" : "fallback",
  })
}

const header = ["file", "legacyPath", "currentSlug", "suggestedSlug", "collisionFlag", "source"]
const lines = [header.map(csvEscape).join(",")]

for (const row of rows) {
  lines.push(
    [
      row.file,
      row.legacyPath,
      row.currentSlug,
      row.suggestedSlug,
      row.collisionFlag,
      row.source,
    ]
      .map(csvEscape)
      .join(",")
  )
}

fs.writeFileSync(OUTPUT_CSV, `${lines.join("\n")}\n`, "utf8")
console.log(`Generated ${rows.length} rows -> ${path.relative(ROOT_DIR, OUTPUT_CSV)}`)
