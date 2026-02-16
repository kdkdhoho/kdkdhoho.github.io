const fs = require("fs")
const path = require("path")

const ROOT_DIR = process.cwd()
const INPUT_CSV = path.join(ROOT_DIR, "slug-migration.csv")

const parseCsv = text => {
  const rows = []
  let row = []
  let field = ""
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]

    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"'
        i += 1
      } else if (ch === '"') {
        inQuotes = false
      } else {
        field += ch
      }
      continue
    }

    if (ch === '"') {
      inQuotes = true
      continue
    }

    if (ch === ",") {
      row.push(field)
      field = ""
      continue
    }

    if (ch === "\n") {
      row.push(field)
      rows.push(row)
      row = []
      field = ""
      continue
    }

    if (ch === "\r") {
      continue
    }

    field += ch
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

const upsertSlugFrontmatter = (content, slug) => {
  const match = content.match(/^---\n([\s\S]*?)\n---(\n|$)/)
  if (!match) return { changed: false, content }

  const frontmatter = match[1]
  const hasSlug = /^slug:\s*['"]?([^'"\n]+)['"]?\s*$/m.test(frontmatter)

  let nextFrontmatter
  if (hasSlug) {
    nextFrontmatter = frontmatter.replace(/^slug:\s*['"]?([^'"\n]+)['"]?\s*$/m, `slug: "${slug}"`)
  } else {
    nextFrontmatter = `${frontmatter}\nslug: "${slug}"`
  }

  const replaced = content.replace(match[0], `---\n${nextFrontmatter}\n---${match[2]}`)
  return { changed: replaced !== content, content: replaced }
}

if (!fs.existsSync(INPUT_CSV)) {
  console.error(`Missing input file: ${path.relative(ROOT_DIR, INPUT_CSV)}`)
  process.exit(1)
}

const csvText = fs.readFileSync(INPUT_CSV, "utf8")
const rows = parseCsv(csvText)
if (rows.length <= 1) {
  console.error("CSV has no data rows")
  process.exit(1)
}

const header = rows[0]
const idxFile = header.indexOf("file")
const idxSuggested = header.indexOf("suggestedSlug")
const idxSource = header.indexOf("source")

if (idxFile === -1 || idxSuggested === -1) {
  console.error("CSV header must include file and suggestedSlug")
  process.exit(1)
}

let updatedCount = 0
let skippedCount = 0

for (const columns of rows.slice(1)) {
  const relFile = columns[idxFile]
  const suggestedSlug = columns[idxSuggested]
  const source = idxSource >= 0 ? columns[idxSource] : ""

  if (!relFile || !suggestedSlug || source === "none") {
    skippedCount += 1
    continue
  }

  const absPath = path.join(ROOT_DIR, relFile)
  if (!fs.existsSync(absPath)) {
    skippedCount += 1
    continue
  }

  const content = fs.readFileSync(absPath, "utf8")
  const result = upsertSlugFrontmatter(content, suggestedSlug)

  if (!result.changed) {
    skippedCount += 1
    continue
  }

  fs.writeFileSync(absPath, result.content, "utf8")
  updatedCount += 1
}

console.log(`Updated ${updatedCount} files, skipped ${skippedCount} rows.`)
