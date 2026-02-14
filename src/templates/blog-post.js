import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import TableOfContents from "../components/toc"
import * as styles from "./blog-post.module.css"

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

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const postHtml = React.useMemo(() => withNewTabLinks(post.html), [post.html])
  const [scrollProgress, setScrollProgress] = React.useState(0)

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
              {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                <div className={styles.tagsContainer}>
                  {post.frontmatter.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
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
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
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
