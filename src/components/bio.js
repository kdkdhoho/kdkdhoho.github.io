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
        끝을 생각하며 살고 있습니다.<br/>
        꿈과 목적과 목표로 나누어 생각합니다.<br/>
        타인과 경쟁하지 않고, 나만의 길을 설정하고 그것에만 집중합니다.
      </p>
    </div>
  )
}

export default Bio
