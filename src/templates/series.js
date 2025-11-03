import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const SeriesTemplate = ({ data, location, pageContext }) => {
  const { series, posts } = pageContext
  const siteTitle = data.site.siteMetadata?.title || `Title`
  
  // 날짜순으로 정렬 (최신순)
  const sortedPosts = posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))

  return (
    <Layout location={location} title={siteTitle}>
      <div className="series-page">
        <header className="series-header">
          <h1 className="series-title">{series}</h1>
          <p className="series-count">{posts.length}개의 포스트</p>
        </header>
        
        <div className="series-posts">
          {sortedPosts.map((post, index) => {
            const title = post.frontmatter.title || post.fields.slug

            return (
              <article
                key={post.fields.slug}
                className="series-post-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <div className="series-post-number">
                  {sortedPosts.length - index}
                </div>
                <div className="series-post-content">
                  <header>
                    <h2>
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <small>{post.frontmatter.date}</small>
                  </header>
                  {post.frontmatter.description && (
                    <section>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: post.frontmatter.description,
                        }}
                        itemProp="description"
                      />
                    </section>
                  )}
                </div>
              </article>
            )
          })}
        </div>
        
        <div className="series-navigation">
          <Link to="/series" className="back-to-series">
            ← 모든 시리즈 보기
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export const Head = ({ pageContext }) => {
  const { series, posts } = pageContext
  return (
    <Seo 
      title={`${series} 시리즈`}
      description={`${series} 시리즈의 모든 포스트 (${posts.length}개)`}
    />
  )
}

export default SeriesTemplate

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`