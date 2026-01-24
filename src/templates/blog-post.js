import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import TableOfContents from "../components/toc"

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`

  React.useEffect(() => {
    const progressBar = document.createElement('div')
    progressBar.className = 'scroll-progress'
    document.body.appendChild(progressBar)

    const updateProgress = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.body.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      progressBar.style.width = scrollPercent + '%'
    }

    window.addEventListener('scroll', updateProgress)
    
    return () => {
      window.removeEventListener('scroll', updateProgress)
      if (document.body.contains(progressBar)) {
        document.body.removeChild(progressBar)
      }
    }
  }, [])

  return (
    <Layout location={location} title={siteTitle}>
      <div className="blog-post-layout">
        <div className="blog-post-container">
          <article
            className="blog-post"
            itemScope
            itemType="http://schema.org/Article"
          >
            <header>
              <h1>{post.frontmatter.title}</h1>
              <p className="post-date">{post.frontmatter.date}</p>
              {post.frontmatter.series && (
                <div className="series-info">
                  <Link to={`/series/${(() => {
                    const map = {
                      '링글 튜터링 복습': 'ringle-tutoring-review',
                      '셀럽잇 프로젝트': 'celuveat-project', 
                      '그림으로 배우는 Http & Network Basic': 'http-network-basic',
                      '창구 AI 스터디 잼': 'changgu-ai-study-jam',
                      '운영체제 면접 스터디': 'os-interview-study',
                      'Why? 시리즈': 'why-series',
                      'DB 면접 스터디': 'db-interview-study',
                      'Real MySQL 8.0': 'real-mysql-8'
                    }
                    return map[post.frontmatter.series] || post.frontmatter.series.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
                  })()}`} className="series-link">
                    📚 {post.frontmatter.series} 시리즈
                  </Link>
                </div>
              )}
              <p>{post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                <div className="tags-container">
                  {post.frontmatter.tags.map(tag => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}</p>
            </header>
            <section
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.html }}
              itemProp="articleBody"
            />
            <hr />
            <footer>
              <Bio />
            </footer>
          </article>
        </div>
        {post.tableOfContents && <TableOfContents tableOfContents={post.tableOfContents} />}
      </div>
      <nav className="blog-post-nav">
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
        series
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
