import * as React from "react"
import { Link, graphql, navigate } from "gatsby"
import { useLocation } from '@reach/router'

import Layout from "../components/layout"
import Seo from "../components/seo"
import { siteMetadata } from "../../gatsby-config"

const SearchPage = ({ data }) => {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filteredPosts, setFilteredPosts] = React.useState([])
  const [sortBy, setSortBy] = React.useState('date') // 'date', 'title', 'relevance'

  const posts = data.allMarkdownRemark.nodes
  const siteTitle = siteMetadata.title || `Title`

  React.useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('q') || ''
    setSearchQuery(query)
    
    if (query.length >= 2) {
      const results = posts.filter(post => {
        const title = post.frontmatter.title?.toLowerCase() || ''
        const description = post.frontmatter.description?.toLowerCase() || ''
        const excerpt = post.excerpt?.toLowerCase() || ''
        const tags = post.frontmatter.tags?.join(' ').toLowerCase() || ''
        const searchTerm = query.toLowerCase()

        return title.includes(searchTerm) || 
               description.includes(searchTerm) || 
               excerpt.includes(searchTerm) ||
               tags.includes(searchTerm)
      })
      setFilteredPosts(results)
    } else {
      setFilteredPosts([])
    }
  }, [location.search, posts])


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      // URL 업데이트
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true })
    } else {
      navigate('/search', { replace: true })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  const sortPosts = (posts, sortType) => {
    switch (sortType) {
      case 'title':
        return [...posts].sort((a, b) => 
          a.frontmatter.title.localeCompare(b.frontmatter.title)
        )
      case 'date':
        return [...posts].sort((a, b) => 
          new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
        )
      case 'relevance':
        // 제목에서 매치되는 것을 우선순위로
        return [...posts].sort((a, b) => {
          const aTitle = a.frontmatter.title?.toLowerCase() || ''
          const bTitle = b.frontmatter.title?.toLowerCase() || ''
          const searchTerm = searchQuery.toLowerCase()
          
          const aInTitle = aTitle.includes(searchTerm) ? 1 : 0
          const bInTitle = bTitle.includes(searchTerm) ? 1 : 0
          
          return bInTitle - aInTitle
        })
      default:
        return posts
    }
  }

  return (
    <Layout location={location} title={siteTitle}>
      <div className="search-page">
        <div className="search-page-header">
          <h1>검색 결과</h1>
          <div className="search-page-input-container">
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className="search-page-input"
              autoFocus
            />
            <button onClick={handleSearch} className="search-page-button">
              검색
            </button>
          </div>
        </div>

        <div className="search-page-results">
          {searchQuery.length >= 2 ? (
            <>
              <div className="search-results-header-section">
                <h2 className="search-results-title">
                  '{searchQuery}' 검색 결과 ({filteredPosts.length}개)
                </h2>
                {filteredPosts.length > 0 && (
                  <div className="search-sort-container">
                    <label htmlFor="sort-select">정렬:</label>
                    <select 
                      id="sort-select"
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="search-sort-select"
                    >
                      <option value="date">최신순</option>
                      <option value="title">제목순</option>
                      <option value="relevance">관련도순</option>
                    </select>
                  </div>
                )}
              </div>
              {filteredPosts.length > 0 ? (
                <div className="posts-grid">
                  {sortPosts(filteredPosts, sortBy).map(post => {
                    const title = post.frontmatter.title || post.fields.slug

                    return (
                      <article
                        key={post.fields.slug}
                        className="post-list-item"
                        itemScope
                        itemType="http://schema.org/Article"
                      >
                        <header>
                          <h2>
                            <Link to={post.fields.slug} itemProp="url">
                              <span 
                                itemProp="headline"
                                dangerouslySetInnerHTML={{
                                  __html: highlightSearchTerm(title, searchQuery)
                                }}
                              />
                            </Link>
                          </h2>
                          <small>{post.frontmatter.date}</small>
                        </header>
                        <section>
                          {post.frontmatter.description && (
                            <p
                              dangerouslySetInnerHTML={{
                                __html: highlightSearchTerm(post.frontmatter.description, searchQuery),
                              }}
                              itemProp="description"
                            />
                          )}
                          {post.frontmatter.tags && (
                            <div className="post-tags">
                              {post.frontmatter.tags.map(tag => (
                                <span key={tag} className="post-tag">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </section>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="search-no-results-page">
                  <span>😔</span>
                  <h3>검색 결과가 없습니다</h3>
                  <p>'{searchQuery}'에 대한 검색 결과를 찾을 수 없습니다.</p>
                  <ul>
                    <li>검색어의 철자가 정확한지 확인해보세요</li>
                    <li>다른 키워드로 검색해보세요</li>
                    <li>더 일반적인 검색어를 사용해보세요</li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="search-page-placeholder">
              <span>🔍</span>
              <h3>검색어를 입력해주세요</h3>
              <p>제목, 설명, 내용, 태그에서 검색합니다.</p>
              <p>최소 2글자 이상 입력해주세요.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const Head = ({ location }) => {
  const params = new URLSearchParams(location.search)
  const query = params.get('q') || ''
  
  return (
    <Seo 
      title={query ? `'${query}' 검색 결과` : "포스트 검색"}
      description={query ? `'${query}'에 대한 검색 결과` : "블로그 포스트를 검색하세요"}
    />
  )
}

export default SearchPage

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY년 M월 D일")
          title
          description
          tags
        }
      }
    }
  }
`
