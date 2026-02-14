import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as styles from "./toc.module.css"

const TableOfContents = ({ tableOfContents }) => {
  const [activeId, setActiveId] = useState("")
  const [headings, setHeadings] = useState([])
  const tocRef = useRef(null)

  const extractTocIds = useCallback(tocHtml => {
    if (!tocHtml) return []

    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = tocHtml
    const links = tempDiv.querySelectorAll('a[href^="#"]')

    return Array.from(links)
      .map(link => {
        const href = link.getAttribute("href")
        if (!href) return null
        const encodedId = href.substring(1)

        try {
          return { encoded: encodedId, decoded: decodeURIComponent(encodedId) }
        } catch {
          return { encoded: encodedId, decoded: encodedId }
        }
      })
      .filter(Boolean)
  }, [])

  useEffect(() => {
    if (!tableOfContents) return

    const findHeadings = () => {
      const tocIdObjects = extractTocIds(tableOfContents)
      const contentHeadings = Array.from(
        document.querySelectorAll(".blog-post-content h1, .blog-post-content h2, .blog-post-content h3, .blog-post-content h4, .blog-post-content h5, .blog-post-content h6")
      ).filter(h => h.id)

      const fromToc = tocIdObjects
        .map(({ encoded, decoded }) => {
          const element = document.getElementById(encoded) || document.getElementById(decoded)
          return element && element.matches("h1, h2, h3, h4, h5, h6") ? element : null
        })
        .filter(Boolean)

      const mergedHeadings = Array.from(new Set([...fromToc, ...contentHeadings])).sort(
        (a, b) => a.offsetTop - b.offsetTop
      )

      setHeadings(mergedHeadings)
      if (mergedHeadings.length > 0) {
        setActiveId(mergedHeadings[0].id)
      }
    }

    const timer = setTimeout(findHeadings, 250)
    return () => clearTimeout(timer)
  }, [extractTocIds, tableOfContents])

  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const scrollY = window.pageYOffset
      let current = headings[0]

      for (let i = 0; i < headings.length; i += 1) {
        const heading = headings[i]
        const offsetTop = heading.getBoundingClientRect().top + scrollY
        if (offsetTop <= scrollY + 140) {
          current = heading
        } else {
          break
        }
      }

      if (current?.id && current.id !== activeId) {
        setActiveId(current.id)
      }
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        handleScroll()
        ticking = false
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [activeId, headings])

  const handleTocClick = useCallback(e => {
    if (e.target.tagName !== "A") return

    e.preventDefault()
    const href = e.target.getAttribute("href")
    if (!href || !href.startsWith("#")) return

    const encodedId = href.substring(1)
    let targetElement = document.getElementById(encodedId)

    if (!targetElement) {
      try {
        targetElement = document.getElementById(decodeURIComponent(encodedId))
      } catch {
        targetElement = null
      }
    }

    if (!targetElement) return

    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 96
    window.scrollTo({ top: offsetTop, behavior: "smooth" })
    setActiveId(targetElement.id)
  }, [])

  const processedTableOfContents = useMemo(() => {
    if (!tableOfContents) return tableOfContents
    let processed = tableOfContents
    processed = processed.replace(/\s*class="[^"]*active[^"]*"/g, "")
    processed = processed.replace(/\s*class=""/g, "")

    if (!activeId) return processed

    try {
      const encodedActiveId = encodeURIComponent(activeId).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const encodedRegex = new RegExp(`(<a[^>]*href="#${encodedActiveId}"[^>]*)(>)`, "g")
      if (encodedRegex.test(processed)) {
        return processed.replace(encodedRegex, `$1 class="${styles.active}"$2`)
      }
    } catch {}

    const escapedId = activeId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const rawRegex = new RegExp(`(<a[^>]*href="#${escapedId}"[^>]*)(>)`, "g")
    return processed.replace(rawRegex, `$1 class="${styles.active}"$2`)
  }, [activeId, tableOfContents])

  const progress = useMemo(() => {
    if (headings.length === 0) return 0
    const currentIndex = headings.findIndex(heading => heading.id === activeId)
    const safeIndex = currentIndex < 0 ? 0 : currentIndex
    return ((safeIndex + 1) / headings.length) * 100
  }, [activeId, headings])

  if (!tableOfContents) return null

  return (
    <aside className={styles.tocContainer} ref={tocRef}>
      <div className={styles.tocHeader}>
        <h3 className={styles.tocTitle}>목차</h3>
      </div>
      <div className={styles.tocProgress} aria-hidden="true">
        <span className={styles.tocProgressFill} style={{ width: `${progress}%` }} />
      </div>
      <div
        className={styles.tocContent}
        onClick={handleTocClick}
        dangerouslySetInnerHTML={{ __html: processedTableOfContents }}
      />
    </aside>
  )
}

export default TableOfContents
