/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  /*const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
            github
          }
        }
      }
    }
  `)*/

  // Set these values by editing "siteMetadata" in gatsby-config.js
  // const author = data.site.siteMetadata?.author
  // const social = data.site.siteMetadata?.social

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif", "jpeg"]}
        src="../images/profile_img.png"
        width={75}
        height={75}
        quality={100}
        alt="Profile picture"
      />
      <p>
        모든 강아지가 행복했으면 하는 꿈을 가진 개발자 김동호입니다.<br/>
        주로 개발 공부, 독서・생각 기록, 유기견 봉사활동 후기 등을 기록하고 있어요.<br/>
      </p>
    </div>
  )
}

export default Bio
