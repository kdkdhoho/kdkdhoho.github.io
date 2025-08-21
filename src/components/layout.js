import * as React from "react"
import { Link } from "gatsby"
import ThemeToggle from "./theme-toggle"
import Search from "./search"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

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
      <div className="top-buttons">
        <Search />
        <ThemeToggle />
      </div>
      <header className="global-header">{header}</header>
      <main>{children}</main>
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
