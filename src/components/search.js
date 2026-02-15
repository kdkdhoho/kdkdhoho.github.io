import React, { useState, useRef, useEffect, useCallback } from "react"
import { useStaticQuery, graphql, navigate } from "gatsby"
import * as styles from "./search.module.css"
import { matchesPostQuery } from "../utils/post-utils"

const Search = ({ variant = "toggle" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  const data = useStaticQuery(graphql`
    query SearchQuery {
      allMarkdownRemark(
        sort: { frontmatter: { date: DESC } }
        filter: { frontmatter: { draft: { ne: true } } }
      ) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            description
            date(formatString: "YYYY년 M월 D일")
            tags
          }
          excerpt(pruneLength: 100)
        }
      }
    }
  `)

  const posts = data.allMarkdownRemark.nodes
  const isInline = variant === "inline"
  const recentPosts = React.useMemo(() => posts.slice(0, 5), [posts])
  const matchedPosts = React.useMemo(() => {
    if (query.length < 2) return []
    return posts.filter(post => matchesPostQuery(post, query)).slice(0, 5)
  }, [posts, query])

  const resetSearchState = useCallback(() => {
    setIsOpen(false)
    setQuery("")
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined

    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        resetSearchState()
      }
    }

    const handleEscape = event => {
      if (event.key === "Escape") {
        resetSearchState()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, resetSearchState])

  const handleSearch = searchQuery => {
    setQuery(searchQuery)
  }

  const handleResultClick = slug => {
    navigate(slug)
    resetSearchState()
  }

  const handleEnterSearch = event => {
    if (event.key !== "Enter") return
    if (isComposing || event.nativeEvent?.isComposing || event.keyCode === 229) return

    if (query.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      resetSearchState()
    }
  }

  const toggleSearch = () => {
    if (!isOpen) {
      setIsOpen(true)
      requestAnimationFrame(() => inputRef.current?.focus())
      return
    }

    resetSearchState()
  }

  const openInlineSearch = () => {
    if (!isOpen) {
      setIsOpen(true)
      setQuery("")
    }
  }

  const renderResultsContent = () => {
    if (!isOpen) return null

    const displayPosts = query.length === 0 ? recentPosts : matchedPosts

    return (
      <>
        {query.length === 0 && displayPosts.length > 0 && (
          <div className={styles.searchResults}>
            <div className={styles.searchResultsHeader}>
              <span>최근 포스트</span>
              <small>최대 5개</small>
            </div>
            {displayPosts.map(post => (
              <button
                key={post.fields.slug}
                type="button"
                className={styles.searchResultItem}
                onClick={() => handleResultClick(post.fields.slug)}
              >
                <h4>{post.frontmatter.title}</h4>
                <p>{post.frontmatter.description || post.excerpt}</p>
                <small>{post.frontmatter.date}</small>
              </button>
            ))}
          </div>
        )}

        {query.length >= 2 && displayPosts.length > 0 && (
          <div className={styles.searchResults}>
            <div className={styles.searchResultsHeader}>
              <span>검색 결과</span>
              <small>{displayPosts.length}개 / 최대 5개</small>
            </div>
            {displayPosts.map(post => (
              <button
                key={post.fields.slug}
                type="button"
                className={styles.searchResultItem}
                onClick={() => handleResultClick(post.fields.slug)}
              >
                <h4>{post.frontmatter.title}</h4>
                <p>{post.frontmatter.description || post.excerpt}</p>
                <small>{post.frontmatter.date}</small>
              </button>
            ))}
          </div>
        )}

        {query.length >= 2 && displayPosts.length === 0 && (
          <div className={styles.searchNoResults}>
            <p>검색 결과가 없습니다.</p>
            <small>다른 키워드로 검색해보세요.</small>
          </div>
        )}
      </>
    )
  }

  if (isInline) {
    return (
      <div className={styles.searchContainer} ref={searchRef}>
        <div className={styles.inlineSearchField}>
          <span className={styles.searchIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.7 11.3 3 3-1.4 1.4-3-3 1.4-1.4z" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="검색 (2글자 이상)"
            value={query}
            onFocus={openInlineSearch}
            onClick={openInlineSearch}
            onChange={event => handleSearch(event.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={event => {
              setIsComposing(false)
              handleSearch(event.target.value)
            }}
            onKeyDown={handleEnterSearch}
            className={styles.inlineSearchInput}
            aria-label="포스트 검색"
          />
        </div>
        {isOpen && <div className={styles.searchDropdown}>{renderResultsContent()}</div>}
      </div>
    )
  }

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <button
        type="button"
        onClick={toggleSearch}
        className={styles.searchToggle}
        aria-label="검색"
        title="검색"
      >
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.7 11.3 3 3-1.4 1.4-3-3 1.4-1.4z" />
        </svg>
      </button>
      {isOpen && (
        <div className={styles.searchDropdown}>
          <input
            ref={inputRef}
            type="text"
            placeholder="포스트 검색... (엔터로 전체 검색)"
            value={query}
            onChange={event => handleSearch(event.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={event => {
              setIsComposing(false)
              handleSearch(event.target.value)
            }}
            onKeyDown={handleEnterSearch}
            className={styles.searchInput}
          />
          {renderResultsContent()}
        </div>
      )}
    </div>
  )
}

export default Search
