import * as React from "react"
import { Link, graphql, navigate } from "gatsby"
import { useLocation } from "@reach/router"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./search-page.module.css"
import {
  getFirstImageFromHtml,
  getReadingTimeText,
  matchesPostQuery,
  normalizeSearchQuery,
} from "../utils/post-utils"

const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

const sortPosts = (posts, sortType, searchQuery) => {
  const normalizedQuery = normalizeSearchQuery(searchQuery)

  switch (sortType) {
    case "title":
      return [...posts].sort((a, b) =>
        (a.frontmatter.title || "").localeCompare(b.frontmatter.title || "", "ko")
      )
    case "relevance":
      return [...posts].sort((a, b) => {
        const aTitle = (a.frontmatter.title || "").toLowerCase()
        const bTitle = (b.frontmatter.title || "").toLowerCase()
        const aInTitle = aTitle.includes(normalizedQuery) ? 1 : 0
        const bInTitle = bTitle.includes(normalizedQuery) ? 1 : 0
        return bInTitle - aInTitle
      })
    case "date":
    default:
      return [...posts].sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
  }
}

const SearchPage = ({ data }) => {
  const location = useLocation()
  const posts = data.allMarkdownRemark.nodes
  const siteTitle = data.site.siteMetadata?.title || `Title`

  const queryFromUrl = React.useMemo(() => {
    const params = new URLSearchParams(location.search || "")
    return params.get("q") || ""
  }, [location.search])

  const [searchInput, setSearchInput] = React.useState(queryFromUrl)
  const [sortBy, setSortBy] = React.useState("date")
  const [isComposing, setIsComposing] = React.useState(false)

  React.useEffect(() => {
    setSearchInput(queryFromUrl)
  }, [queryFromUrl])

  const filteredPosts = React.useMemo(() => {
    if (queryFromUrl.trim().length < 2) return []
    return posts.filter(post => matchesPostQuery(post, queryFromUrl))
  }, [posts, queryFromUrl])

  const sortedPosts = React.useMemo(
    () => sortPosts(filteredPosts, sortBy, queryFromUrl),
    [filteredPosts, sortBy, queryFromUrl]
  )

  const handleSearchSubmit = event => {
    event.preventDefault()
    if (isComposing) return

    const nextQuery = searchInput.trim()
    if (nextQuery.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(nextQuery)}`, { replace: true })
      return
    }
    navigate("/search", { replace: true })
  }

  const handleSearchInputKeyDown = event => {
    if (event.key !== "Enter") return
    if (isComposing || event.nativeEvent?.isComposing || event.keyCode === 229) {
      event.preventDefault()
    }
  }

  return (
    <Layout location={location} title={siteTitle} showLatestPostsInSidebar={false}>
      <section className={styles.searchPage}>
        <header className={styles.searchHeader}>
          <h1 className={styles.searchTitle}>검색 결과</h1>
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={event => {
                setIsComposing(false)
                setSearchInput(event.target.value)
              }}
              onKeyDown={handleSearchInputKeyDown}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              검색
            </button>
          </form>
        </header>

        {queryFromUrl.length >= 2 ? (
          <>
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>
                '{queryFromUrl}' 검색 결과 <span>({filteredPosts.length}개)</span>
              </h2>
              {filteredPosts.length > 0 && (
                <div className={styles.sortWrap}>
                  <label htmlFor="sort-select">정렬</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={event => setSortBy(event.target.value)}
                    className={styles.sortSelect}
                  >
                    <option value="date">최신순</option>
                    <option value="title">제목순</option>
                    <option value="relevance">관련도순</option>
                  </select>
                </div>
              )}
            </div>

            {sortedPosts.length > 0 ? (
              <div className={styles.resultsList}>
                {sortedPosts.map(post => {
                  const title = post.frontmatter.title || post.fields.slug
                  const description = post.frontmatter.description || post.excerpt
                  const thumbnailSrc = getFirstImageFromHtml(post.html)
                  const readingTime = getReadingTimeText(post.timeToRead)

                  return (
                    <article key={post.fields.slug} className={styles.resultCard}>
                      <Link to={post.fields.slug} className={styles.resultLink}>
                        <div className={styles.cardBody}>
                          {thumbnailSrc && (
                            <div className={styles.thumbnailWrap}>
                              <img
                                src={thumbnailSrc}
                                alt={`${title} 썸네일`}
                                className={styles.thumbnailImage}
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className={styles.cardContent}>
                            <h3
                              className={styles.cardTitle}
                              dangerouslySetInnerHTML={{
                                __html: highlightSearchTerm(title, queryFromUrl),
                              }}
                            />
                            <div className={styles.cardMeta}>
                              <span className={styles.cardDate}>{post.frontmatter.date}</span>
                              <span className={styles.readingTime}>{readingTime}</span>
                            </div>
                            <p
                              className={styles.cardDescription}
                              dangerouslySetInnerHTML={{
                                __html: highlightSearchTerm(description, queryFromUrl),
                              }}
                            />
                          </div>
                        </div>
                      </Link>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h3>검색 결과가 없습니다</h3>
                <p>'{queryFromUrl}'에 대한 결과를 찾지 못했습니다.</p>
                <ul>
                  <li>검색어 철자를 확인해보세요.</li>
                  <li>더 짧거나 일반적인 키워드를 시도해보세요.</li>
                  <li>다른 조합의 단어로 검색해보세요.</li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className={styles.placeholderState}>
            <h3>검색어를 입력해주세요</h3>
            <p>제목, 설명, 본문, 태그에서 검색합니다. (최소 2글자)</p>
          </div>
        )}
      </section>
    </Layout>
  )
}

export const Head = ({ location }) => {
  const params = new URLSearchParams(location.search || "")
  const query = params.get("q") || ""

  return (
    <Seo
      title={query ? `'${query}' 검색 결과` : "포스트 검색"}
      description={query ? `'${query}'에 대한 검색 결과` : "블로그 포스트를 검색하세요"}
      pathname={location.pathname}
      noindex
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
        html
        timeToRead
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
