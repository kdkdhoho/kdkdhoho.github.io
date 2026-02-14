import * as React from "react"
import { useMemo } from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const getCategoryPathFromSlug = slug => {
  const parts = slug.split("/").filter(Boolean)
  if (parts.length <= 1) return ""
  return parts.slice(0, -1).join("/")
}

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

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
        <Bio />
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
    <Layout location={location} title={siteTitle}>
      <Bio />

      <div className="posts-grid">
        {filteredPosts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <article
              key={post.fields.slug}
              className="post-list-item"
              itemScope
              itemType="http://schema.org/Article"
            >
              <Link to={post.fields.slug} itemProp="url" className="post-link">
                <div className="post-card-content">
                  <header className="post-card-header">
                    <h2 className="post-title">
                      <span itemProp="headline">{title}</span>
                    </h2>
                    <small className="post-date">{post.frontmatter.date}</small>
                  </header>
                  <section className="post-card-excerpt">
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
                <footer className="post-card-footer">
                  {post.frontmatter.tags && (
                    <div className="post-tags">
                      {post.frontmatter.tags.map(tag => (
                        <span key={tag} className="post-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </footer>
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
export const Head = () => <Seo title="All posts" />

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
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY년 M월 D일")
          title
          description
          tags
        }
      }
    }
  }
`
