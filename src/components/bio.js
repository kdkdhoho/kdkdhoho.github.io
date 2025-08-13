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
        src="../images/profile_img.jpeg"
        width={75}
        height={75}
        quality={100}
        alt="Profile picture"
      />
      <p>
        1. 2025년이 끝나기 전까지 <strong>기본기를 완벽히 정리한다.</strong><br/>
        2. <strong>내가 좋아하는 것</strong>을 차곡히 기록한다.<br/>
        3. 하루하루는 치열하게, 인생은 흘러가는대로~
      </p>
    </div>
  )
}

export default Bio
