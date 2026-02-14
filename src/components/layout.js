import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Search from "./search"
import Bio from "./bio"
import * as styles from "./layout.module.css"

const getCategoryPathFromSlug = slug => {
  const parts = slug.split("/").filter(Boolean)
  if (parts.length <= 1) return ""
  return parts.slice(0, -1).join("/")
}

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

  const posts = data.allMarkdownRemark.nodes

  const categories = React.useMemo(() => {
    const root = {
      name: "All",
      path: "All",
      count: posts.length,
      children: new Map(),
    }

    posts.forEach(post => {
      const categoryPath = getCategoryPathFromSlug(post.fields.slug)
      if (!categoryPath) return

      const segments = categoryPath.split("/")
      let cursor = root

      segments.forEach((segment, index) => {
        const nodePath = segments.slice(0, index + 1).join("/")

        if (!cursor.children.has(segment)) {
          cursor.children.set(segment, {
            name: segment,
            path: nodePath,
            count: 0,
            children: new Map(),
          })
        }

        cursor = cursor.children.get(segment)
        cursor.count += 1
      })
    })

    const sortTree = nodes =>
      nodes
        .sort((a, b) => a.name.localeCompare(b.name, "ko"))
        .map(node => ({
          ...node,
          children: sortTree(Array.from(node.children.values())),
        }))

    return sortTree(Array.from(root.children.values()))
  }, [posts])

  const currentCategory = React.useMemo(() => {
    const params = new URLSearchParams(location.search || "")
    return params.get("category") || "All"
  }, [location.search])

  const getCategoryLink = categoryPath =>
    categoryPath === "All" ? "/" : `/?category=${encodeURIComponent(categoryPath)}`

  const renderCategoryNodes = (nodes, depth = 0) => (
    <ul className={styles.sidebarCategoryList}>
      {nodes.map(node => {
        const isActive =
          currentCategory === node.path ||
          (currentCategory !== "All" && currentCategory.startsWith(`${node.path}/`))

        return (
          <li key={node.path} className={styles.sidebarCategoryListItem}>
            <Link
              to={getCategoryLink(node.path)}
              className={`${styles.sidebarCategoryItem} ${isActive ? styles.activeCategory : ""}`}
              style={{ "--depth": depth }}
            >
              <span className={styles.categoryName}>{node.name.replace(/-/g, " ")}</span>
              <span className={styles.categoryCount}>{node.count}</span>
            </Link>
            {node.children.length > 0 && renderCategoryNodes(node.children, depth + 1)}
          </li>
        )
      })}
    </ul>
  )

  if (isRootPath) {
    header = (
      <h1 className={styles.mainHeading}>
        <Link to="/" className={styles.titleLink}>
          {title}
        </Link>
      </h1>
    )
  } else {
    header = (
      <Link to="/" className={styles.titleLink}>
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className={styles.globalHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.headerSide} aria-hidden="true" />
          <div className={styles.headerCenter}>{header}</div>
          <div className={styles.headerRight}>
            <Search variant="inline" />
          </div>
        </div>
      </header>

      <div className={styles.layoutContainer}>
        <aside className={styles.sidebar}>
          <Bio variant="compact" />
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Categories</h3>
            <div className={styles.categoryScrollArea}>
              <ul className={styles.sidebarCategoryList}>
                <li className={styles.sidebarCategoryListItem}>
                  <Link
                    to={getCategoryLink("All")}
                    className={`${styles.sidebarCategoryItem} ${
                      currentCategory === "All" ? styles.activeCategory : ""
                    }`}
                    style={{ "--depth": 0 }}
                  >
                    <span className={styles.categoryName}>All</span>
                    <span className={styles.categoryCount}>{posts.length}</span>
                  </Link>
                </li>
              </ul>
              {renderCategoryNodes(categories)}
            </div>
          </div>
        </aside>

        <main className={styles.mainContent}>{children}</main>
      </div>

      <footer
        style={{
          textAlign: "center",
          padding: "var(--spacing-12) 0",
          marginTop: "var(--spacing-16)",
          borderTop: "1px solid var(--color-border)",
          color: "var(--color-text-light)",
          fontSize: "var(--fontSize-0)",
        }}
      >
        © {new Date().getFullYear()} kdkdhoho. Built with{" "}
        <a
          href="https://www.gatsbyjs.com"
          style={{
            color: "var(--color-primary)",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Gatsby
        </a>
      </footer>
    </div>
  )
}

export default Layout
