import * as React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <div className="not-found-container">
        <div className="not-found-content">
          <span className="not-found-emoji" role="img" aria-label="Compass">🧭</span>
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">페이지를 찾을 수 없습니다</h2>
          <p className="not-found-description">
            방문하시려는 페이지의 주소가 잘못 입력되었거나,<br />
            페이지의 주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
          </p>
          <Link to="/" className="not-found-button">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
