/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post.js`)
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const getCategoryPathFromLegacySlug = legacySlug => {
  const parts = (legacySlug || "").split("/").filter(Boolean)
  if (parts.length <= 1) return ""
  return parts.slice(0, -1).join("/")
}

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions

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
          fileAbsolutePath
          fields {
            slug
            legacySlug
          }
          frontmatter {
            slug
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
  const duplicatedPaths = new Map()

  posts.forEach(post => {
    const canonicalPath = post.fields?.slug
    if (!canonicalPath) return

    if (!duplicatedPaths.has(canonicalPath)) {
      duplicatedPaths.set(canonicalPath, [post.fileAbsolutePath || post.id])
      return
    }

    duplicatedPaths.get(canonicalPath).push(post.fileAbsolutePath || post.id)
  })

  const duplicates = Array.from(duplicatedPaths.entries()).filter(([, refs]) => refs.length > 1)
  if (duplicates.length > 0) {
    const details = duplicates
      .map(([canonicalPath, refs]) => `${canonicalPath}\n  - ${refs.join("\n  - ")}`)
      .join("\n")

    reporter.panicOnBuild(
      `Duplicated canonical slugs were found. Each post frontmatter.slug must be unique.\n${details}`
    )
    return
  }

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

      if (post.fields.legacySlug && post.fields.legacySlug !== post.fields.slug) {
        createRedirect({
          fromPath: post.fields.legacySlug,
          toPath: post.fields.slug,
          isPermanent: true,
          redirectInBrowser: true,
        })
      }
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode, reporter }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const legacySlug = createFilePath({ node, getNode })
    const categoryPath = getCategoryPathFromLegacySlug(legacySlug)
    const markdownFileNode = getNode(node.parent)
    const filePath = markdownFileNode?.absolutePath || node.fileAbsolutePath || node.id
    const frontmatterSlug = node.frontmatter?.slug?.trim()
    const isDraft = node.frontmatter?.draft === true

    if (!isDraft && !frontmatterSlug) {
      reporter.panicOnBuild(
        `Missing frontmatter.slug for post file: ${filePath}. Add a unique slug and rebuild.`
      )
      return
    }

    if (frontmatterSlug && !SLUG_PATTERN.test(frontmatterSlug)) {
      reporter.panicOnBuild(
        `Invalid frontmatter.slug "${frontmatterSlug}" in ${filePath}. Use lowercase letters, numbers, and hyphens only.`
      )
      return
    }

    const canonicalSlug = frontmatterSlug ? `/posts/${frontmatterSlug}/` : legacySlug

    createNodeField({
      name: `slug`,
      node,
      value: canonicalSlug,
    })

    createNodeField({
      name: `legacySlug`,
      node,
      value: legacySlug,
    })

    createNodeField({
      name: `categoryPath`,
      node,
      value: categoryPath,
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
      title: String
      description: String
      author: Author
      siteUrl: String
      siteImage: String
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
      tags: [String]
      draft: Boolean
      slug: String
    }

    type Fields {
      slug: String
      legacySlug: String
      categoryPath: String
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
