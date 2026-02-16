import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import TableOfContents from "../components/toc"
import * as styles from "./blog-post.module.css"
import { getFirstImageFromHtml } from "../utils/post-utils"

const withNewTabLinks = html => {
  if (!html) return html

  return html.replace(/<a\s+([^>]*href=(?:"[^"]*"|'[^']*')[^>]*)>/gi, (match, attrs) => {
    let nextAttrs = attrs

    if (!/\btarget\s*=/i.test(nextAttrs)) {
      nextAttrs = `${nextAttrs} target="_blank"`
    } else {
      nextAttrs = nextAttrs.replace(/\btarget\s*=\s*(['"])[^'"]*\1/i, 'target="_blank"')
    }

    if (!/\brel\s*=/i.test(nextAttrs)) {
      nextAttrs = `${nextAttrs} rel="noopener noreferrer"`
    } else {
      nextAttrs = nextAttrs.replace(/\brel\s*=\s*(['"])([^'"]*)\1/i, (relMatch, quote, value) => {
        const tokens = value.split(/\s+/).filter(Boolean)
        if (!tokens.includes("noopener")) tokens.push("noopener")
        if (!tokens.includes("noreferrer")) tokens.push("noreferrer")
        return `rel=${quote}${tokens.join(" ")}${quote}`
      })
    }

    return `<a ${nextAttrs}>`
  })
}

const copyTextToClipboard = async text => {
  if (typeof window === "undefined") return false

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }

  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "absolute"
  textarea.style.left = "-9999px"
  document.body.appendChild(textarea)
  textarea.select()

  const copied = document.execCommand("copy")
  document.body.removeChild(textarea)
  return copied
}

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const postHtml = React.useMemo(() => withNewTabLinks(post.html), [post.html])
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const [toastMessage, setToastMessage] = React.useState("")
  const [isToastVisible, setIsToastVisible] = React.useState(false)
  const toastTimerRef = React.useRef(null)

  React.useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.body.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [])

  React.useEffect(
    () => () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current)
      }
    },
    []
  )

  const handleShareClick = async () => {
    try {
      const currentUrl = typeof window !== "undefined" ? window.location.href : location.pathname
      const copied = await copyTextToClipboard(currentUrl)
      const message = copied ? "링크가 복사되었습니다." : "복사에 실패했습니다."
      setToastMessage(message)
      setIsToastVisible(true)
    } catch (error) {
      setToastMessage("복사에 실패했습니다.")
      setIsToastVisible(true)
    }

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
    }

    toastTimerRef.current = window.setTimeout(() => {
      setIsToastVisible(false)
    }, 2200)
  }

  return (
    <Layout location={location} title={siteTitle} variant="post">
      <div className={styles.scrollProgress} style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
      <div className={styles.blogPostLayout}>
        <div className={styles.blogPostContainer}>
          <article
            className={styles.blogPost}
            itemScope
            itemType="http://schema.org/Article"
          >
            <header className={styles.blogPostHeader}>
              <h1 className={styles.postTitle}>{post.frontmatter.title}</h1>
              <time className={styles.postDate}>{post.frontmatter.date}</time>
              <div className={styles.metaRow}>
                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                  <div className={styles.tagsContainer}>
                    {post.frontmatter.tags.map(tag => (
                      <span key={tag} className={styles.tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className={styles.shareButton}
                  onClick={handleShareClick}
                  aria-label="링크 공유"
                  title="링크 공유"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={styles.shareIcon}
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.9 2.9 0 0 0 0-1.39l7.05-4.11A2.99 2.99 0 1 0 15 5a3 3 0 0 0 .05.52L8 9.63a3 3 0 1 0 0 4.74l7.05 4.11c-.03.17-.05.34-.05.52a3 3 0 1 0 3-2.92Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </header>
            <section
              className={`${styles.blogPostContent} blog-post-content`}
              dangerouslySetInnerHTML={{ __html: postHtml }}
              itemProp="articleBody"
            />
            <hr className={styles.postDivider} />
          </article>
          <nav className={styles.blogPostNav}>
            <ul>
              <li>
                {previous && (
                  <Link to={previous.fields.slug} rel="이전 글">
                    {previous.frontmatter.title}
                  </Link>
                )}
              </li>
              <li>
                {next && (
                  <Link to={next.fields.slug} rel="다음 글">
                    {next.frontmatter.title}
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
        {post.tableOfContents && <TableOfContents tableOfContents={post.tableOfContents} />}
      </div>
      <div
        className={`${styles.toast} ${isToastVisible ? styles.toastVisible : ""}`}
        role="status"
        aria-live="polite"
      >
        {toastMessage}
      </div>
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post }, location }) => {
  const image = getFirstImageFromHtml(post.html)

  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
      pathname={location.pathname}
      image={image}
      article
      publishedTime={post.frontmatter.dateISO}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      tableOfContents
      frontmatter {
        title
        date(formatString: "YYYY년 M월 D일")
        dateISO: date(formatString: "YYYY-MM-DD")
        description
        tags
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
