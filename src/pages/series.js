import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const SeriesIndexPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const series = data.allMarkdownRemark.group

  return (
    <Layout location={location} title={siteTitle}>
      <div className="series-index-page">
        <header className="series-index-header">
          <h1>모든 시리즈</h1>
          <p>주제별로 정리된 포스트 시리즈를 확인해보세요</p>
        </header>
        
        <div className="series-grid">
          {series.map(({ fieldValue, totalCount, nodes }) => {
            const createSlug = (str) => {
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
              return map[str] || str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
            }
            
            const seriesSlug = createSlug(fieldValue)
            const latestPost = nodes.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))[0]
            
            return (
              <div key={fieldValue} className="series-card">
                <div className="series-card-header">
                  <h2>
                    <Link to={`/series/${seriesSlug}`}>
                      {fieldValue}
                    </Link>
                  </h2>
                  <span className="series-post-count">{totalCount}개 포스트</span>
                </div>
                
                <div className="series-card-content">
                  {latestPost && (
                    <div className="latest-post">
                      <p className="latest-post-label">최신 포스트:</p>
                      <Link to={latestPost.fields.slug} className="latest-post-title">
                        {latestPost.frontmatter.title}
                      </Link>
                      <small className="latest-post-date">{latestPost.frontmatter.date}</small>
                    </div>
                  )}
                  
                  <div className="series-preview">
                    <p>시리즈 포스트 미리보기:</p>
                    <ul className="series-post-list">
                      {nodes.slice(0, 3).map((post) => (
                        <li key={post.fields.slug}>
                          <Link to={post.fields.slug}>
                            {post.frontmatter.title}
                          </Link>
                        </li>
                      ))}
                      {totalCount > 3 && (
                        <li className="more-posts">
                          <Link to={`/series/${seriesSlug}`}>
                            그리고 {totalCount - 3}개 더...
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="series-card-footer">
                  <Link to={`/series/${seriesSlug}`} className="view-series-link">
                    시리즈 전체보기 →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo 
    title="시리즈"
    description="주제별로 정리된 블로그 포스트 시리즈 모음"
  />
)

export default SeriesIndexPage

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { series: { ne: null } } }
    ) {
      group(field: { frontmatter: { series: SELECT } }) {
        fieldValue
        totalCount
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "YYYY년 M월 D일")
            description
          }
        }
      }
    }
  }
`