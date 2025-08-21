import React, { useState, useRef, useEffect } from 'react'
import { useStaticQuery, graphql, navigate } from 'gatsby'

const Search = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  const data = useStaticQuery(graphql`
    query SearchQuery {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      inputRef.current?.focus()
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery)
    
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    const filteredPosts = posts.filter(post => {
      const title = post.frontmatter.title?.toLowerCase() || ''
      const description = post.frontmatter.description?.toLowerCase() || ''
      const excerpt = post.excerpt?.toLowerCase() || ''
      const tags = post.frontmatter.tags?.join(' ').toLowerCase() || ''
      const searchTerm = searchQuery.toLowerCase()

      return title.includes(searchTerm) || 
             description.includes(searchTerm) || 
             excerpt.includes(searchTerm) ||
             tags.includes(searchTerm)
    })

    setResults(filteredPosts.slice(0, 5))
  }

  const handleResultClick = (slug) => {
    navigate(slug)
    setIsOpen(false)
    setQuery('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  const toggleSearch = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // 검색창이 열릴 때 최근 포스트 5개를 기본으로 보여줌
      setResults(posts.slice(0, 5))
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }

  return (
    <div className="search-container" ref={searchRef}>
      <button
        onClick={toggleSearch}
        className="search-toggle"
        aria-label="검색"
        title="검색"
      >
        🔍
      </button>
      
      {isOpen && (
        <div className="search-dropdown">
          <input
            ref={inputRef}
            type="text"
            placeholder="포스트 검색... (엔터로 전체 검색)"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          
          {query.length === 0 && results.length > 0 && (
            <div className="search-results">
              <div className="search-results-header">
                <span>최근 포스트</span>
                <small>최대 5개</small>
              </div>
              {results.map(post => (
                <div
                  key={post.fields.slug}
                  className="search-result-item"
                  onClick={() => handleResultClick(post.fields.slug)}
                >
                  <h4>{post.frontmatter.title}</h4>
                  <p>{post.frontmatter.description || post.excerpt}</p>
                  <small>{post.frontmatter.date}</small>
                </div>
              ))}
            </div>
          )}

          {query.length >= 2 && results.length > 0 && (
            <div className="search-results">
              <div className="search-results-header">
                <span>검색 결과</span>
                <small>{results.length}개 / 최대 5개</small>
              </div>
              {results.map(post => (
                <div
                  key={post.fields.slug}
                  className="search-result-item"
                  onClick={() => handleResultClick(post.fields.slug)}
                >
                  <h4>{post.frontmatter.title}</h4>
                  <p>{post.frontmatter.description || post.excerpt}</p>
                  <small>{post.frontmatter.date}</small>
                </div>
              ))}
            </div>
          )}
          
          {query.length >= 2 && results.length === 0 && (
            <div className="search-no-results">
              <span>😔</span>
              <p>검색 결과가 없습니다.</p>
              <small>다른 키워드로 검색해보세요.</small>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search