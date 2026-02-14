/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const toAbsoluteUrl = (siteUrl, pathOrUrl) => {
  if (!siteUrl || !pathOrUrl) return null
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`
  return `${siteUrl}${normalizedPath}`
}

const Seo = ({
  description,
  title,
  pathname,
  image,
  article = false,
  noindex = false,
  publishedTime,
  children,
}) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
            siteImage
            social {
              twitter
            }
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const siteUrl = site.siteMetadata?.siteUrl
  const canonical = pathname ? toAbsoluteUrl(siteUrl, pathname) : null
  const imageUrl = toAbsoluteUrl(siteUrl, image || site.siteMetadata?.siteImage)
  const twitterCard = imageUrl ? "summary_large_image" : "summary"

  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="description" content={metaDescription} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={article ? "article" : "website"} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={defaultTitle || title} />
      <meta property="og:locale" content="ko_KR" />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      <meta name="twitter:card" content={twitterCard} />
      {site.siteMetadata?.social?.twitter && (
        <meta name="twitter:creator" content={site.siteMetadata.social.twitter} />
      )}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {children}
    </>
  )
}

export default Seo
