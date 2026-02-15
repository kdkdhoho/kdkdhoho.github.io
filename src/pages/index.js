import * as React from "react"
import { useMemo } from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./index.module.css"
import { getFirstImageFromHtml, getReadingTimeText } from "../utils/post-utils"

const getCategoryPathFromSlug = slug => {
  const parts = slug.split("/").filter(Boolean)
  if (parts.length <= 1) return ""
  return parts.slice(0, -1).join("/")
}

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
  const recentPosts = posts.slice(0, 5)

  const selectedCategory = useMemo(() => {
    const params = new URLSearchParams(location.search || "")
    return params.get("category") || "All"
  }, [location.search])

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") return posts

    return posts.filter(post => {
      const categoryPath = getCategoryPathFromSlug(post.fields.slug)
      return (
        categoryPath === selectedCategory ||
        categoryPath.startsWith(`${selectedCategory}/`)
      )
    })
  }, [posts, selectedCategory])

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <div className="empty-posts">
          <p>
            No blog posts found. Add markdown posts to "content/blog" (or the
            directory you specified for the "gatsby-source-filesystem" plugin in
            gatsby-config.js).
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle} showLatestPostsInSidebar={false}>
      <section className={styles.latestPostsSection}>
        <h2 className={styles.latestPostsTitle}>최신 글</h2>
        <ul className={styles.latestPostsList}>
          {recentPosts.map(post => {
            const latestTitle = post.frontmatter.title || post.fields.slug
            const latestThumbnailSrc = getFirstImageFromHtml(post.html)

            return (
              <li key={post.fields.slug} className={styles.latestPostsItem}>
                <Link to={post.fields.slug} className={styles.latestPostsLink}>
                  <div className={styles.latestPostThumbnailWrap}>
                    {latestThumbnailSrc ? (
                      <img
                        src={latestThumbnailSrc}
                        alt={`${latestTitle} 썸네일`}
                        className={styles.latestPostThumbnailImage}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.latestPostThumbnailFallback} aria-hidden="true" />
                    )}
                  </div>
                  <div className={styles.latestPostContent}>
                    <h3 className={styles.latestPostTitle}>{latestTitle}</h3>
                    <time className={styles.latestPostsDate}>{post.frontmatter.date}</time>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <div className={styles.postsGrid}>
        {filteredPosts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const thumbnailSrc = getFirstImageFromHtml(post.html)
          const readingTime = getReadingTimeText(post.timeToRead)

          return (
            <article
              key={post.fields.slug}
              className={styles.postListItem}
              itemScope
              itemType="http://schema.org/Article"
            >
              <Link to={post.fields.slug} itemProp="url" className={styles.postLink}>
                <div className={styles.postCardBody}>
                  {thumbnailSrc && (
                    <div className={styles.postThumbnailWrapper}>
                      <img
                        src={thumbnailSrc}
                        alt={`${title} 썸네일`}
                        className={styles.postThumbnailImage}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className={styles.postCardContent}>
                    <header className={styles.postCardHeader}>
                      <h2 className={styles.postTitle}>
                        <span itemProp="headline">{title}</span>
                      </h2>
                      <div className={styles.postMeta}>
                        <small className={styles.postDate}>{post.frontmatter.date}</small>
                        <span className={styles.readingTimeText}>{readingTime}</span>
                      </div>
                    </header>
                    <section className={styles.postCardExcerpt}>
                      {post.frontmatter.description && (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: post.frontmatter.description,
                          }}
                          itemProp="description"
                        />
                      )}
                    </section>
                  </div>
                </div>
              </Link>
            </article>
          )
        })}
      </div>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = ({ location }) => (
  <Seo
    title="All posts"
    description="최신 개발 글과 학습 기록을 확인할 수 있습니다."
    pathname={location.pathname}
  />
)

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      nodes {
        excerpt
        html
        timeToRead
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY년 M월 D일")
          title
          description
        }
      }
    }
  }
`
