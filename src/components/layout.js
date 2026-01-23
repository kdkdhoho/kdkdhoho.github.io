import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Search from "./search"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  const data = useStaticQuery(graphql`
    query LayoutQuery {
      allMarkdownRemark(filter: { frontmatter: { draft: { ne: true } } }) {
        nodes {
          fields {
            slug
          }
        }
      }
    }
  `)

  // 카테고리 추출 로직
  const categories = React.useMemo(() => {
    const posts = data.allMarkdownRemark.nodes
    const categoryMap = new Map()
    categoryMap.set("All", posts.length)

    posts.forEach(post => {
      const slug = post.fields.slug
      const parts = slug.split("/").filter(Boolean)
      const category = parts.length >= 2 ? parts[0] : "Etc"
      
      const count = categoryMap.get(category) || 0
      categoryMap.set(category, count + 1)
    })

    return Array.from(categoryMap.entries()).sort((a, b) => {
      if (a[0] === "All") return -1
      if (b[0] === "All") return 1
      if (a[0] === "Etc") return 1
      if (b[0] === "Etc") return -1
      return a[0].localeCompare(b[0])
    })
  }, [data])

  // 현재 선택된 카테고리 파싱 (URL 쿼리 스트링)
  const currentCategory = React.useMemo(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(location.search)
      return params.get("category") || "All"
    }
    return "All"
  }, [location.search])

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        <div className="header-container">
          <div className="header-left">
            {header}
          </div>
          <div className="header-right">
            {/* Series 링크 제거됨 */}
            <div className="header-buttons">
              <Search />
            </div>
          </div>
        </div>
      </header>
      
      <div className="layout-container">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>Categories</h3>
            <ul className="sidebar-category-list">
              {categories.map(([category, count]) => (
                <li key={category}>
                  <Link 
                    to={`/?category=${category}`} 
                    className={`sidebar-category-item ${currentCategory === category ? "active" : ""}`}
                  >
                    {category} ({count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="main-content">{children}</main>
      </div>

      <footer style={{
        textAlign: 'center',
        padding: 'var(--spacing-12) 0',
        marginTop: 'var(--spacing-16)',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-light)',
        fontSize: 'var(--fontSize-0)'
      }}>
        © {new Date().getFullYear()} kdkdhoho. Built with{` `}
        <a 
          href="https://www.gatsbyjs.com"
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Gatsby
        </a>
      </footer>
    </div>
  )
}

export default Layout
