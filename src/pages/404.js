import * as React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./404.module.css"

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <section className={styles.notFoundPage}>
        <div className={styles.heroCard}>
          <span className={styles.errorCode}>404</span>
          <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
          <p className={styles.description}>
            요청하신 주소가 변경되었거나 삭제되었습니다.
            <br />
            아래 버튼으로 홈 또는 검색 페이지로 이동해 주세요.
          </p>
          <div className={styles.actions}>
            <Link to="/" className={styles.primaryButton}>
              홈으로 이동
            </Link>
            <Link to="/search" className={styles.secondaryButton}>
              포스트 검색
            </Link>
          </div>
        </div>
      </section>
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
