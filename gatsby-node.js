/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post.js`)

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { frontmatter: { date: ASC } }
        filter: { frontmatter: { draft: { ne: true } } }
        limit: 1000
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            series
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }

  // Create series pages
  const seriesResult = await graphql(`
    {
      allMarkdownRemark(
        filter: { 
          frontmatter: { 
            series: { ne: null },
            draft: { ne: true }
          } 
        }
      ) {
        group(field: { frontmatter: { series: SELECT } }) {
          fieldValue
          nodes {
            id
            frontmatter {
              title
              date
              description
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  if (seriesResult.errors) {
    reporter.panicOnBuild(
      `There was an error loading series data`,
      seriesResult.errors
    )
    return
  }

  const series = seriesResult.data.allMarkdownRemark.group
  const seriesTemplate = path.resolve(`./src/templates/series.js`)

  // Create individual series pages
  series.forEach(({ fieldValue, nodes }) => {
    // 한글을 영어로 변환하는 함수
    const createSlug = (str) => {
      const map = {
        '링글 튜터링 복습': 'ringle-tutoring-review',
        '셀럽잇 프로젝트': 'celuveat-project', 
        '그림으로 배우는 Http & Network Basic': 'http-network-basic',
        '창구 AI 스터디 잼': 'changgu-ai-study-jam',
        '운영체제 면접 스터디': 'os-interview-study',
        'Why? 시리즈': 'why-series',
        'DB 면접 스터디': 'db-interview-study',
        'Real MySQL 8.0': 'real-mysql-8'
      }
      
      return map[str] || str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    }
    
    const seriesSlug = createSlug(fieldValue)
    
    createPage({
      path: `/series/${seriesSlug}`,
      component: seriesTemplate,
      context: {
        series: fieldValue,
        posts: nodes,
      },
    })
  })
}

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      series: String
      tags: [String]
      draft: Boolean
    }

    type Fields {
      slug: String
    }
  `)
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    Frontmatter: {
      draft: {
        resolve(source) {
          return source.draft || false
        },
      },
    },
  })
}

/**
 * @type {import('gatsby').GatsbyNode['onCreatePage']}
 */
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/404\/$/)) {
    page.matchPath = "/*"

    // Update the page.
    createPage(page)
  }
}
