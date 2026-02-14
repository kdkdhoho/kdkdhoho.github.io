// custom typefaces
import "@fontsource/pretendard"
// normalize CSS across browsers
import "./src/normalize.css"
// custom CSS styles
import "./src/style.css"

// Highlighting for code blocks
import "prismjs/themes/prism.css"

export const shouldUpdateScroll = ({ routerProps }) => {
  const hasHash = Boolean(routerProps?.location?.hash)

  // Keep native behavior only for in-page anchor navigation.
  if (hasHash) return true
  return [0, 0]
}

const forceScrollTop = () => {
  window.scrollTo(0, 0)
  requestAnimationFrame(() => window.scrollTo(0, 0))
  setTimeout(() => window.scrollTo(0, 0), 0)
  setTimeout(() => window.scrollTo(0, 0), 120)
  setTimeout(() => window.scrollTo(0, 0), 300)
}

export const onClientEntry = () => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual"
  }
}

export const onInitialClientRender = () => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual"
  }
  if (!window.location.hash) {
    forceScrollTop()
  }
}

export const onRouteUpdate = ({ location }) => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual"
  }
  if (!location?.hash) {
    forceScrollTop()
  }
}
