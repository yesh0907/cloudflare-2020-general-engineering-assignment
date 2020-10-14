// Include Routing module for different URL paths
const Router = require('./router')

// links to show on webpage
const links = [
  {"name": "Facebook", "url": "https://facebook.com"}, 
  {"name": "Instagram", "url": "https://instagram.com"},
  {"name": "Github", "url": "https://github.com"}
]
// URL of static HTML site to be fetched
const staticHTMLUrl = 'https://static-links-page.signalnerve.workers.dev'
// URL of Profile picture to display
const profileImgSrc = 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Round&hairColor=BrownDark&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Brown'
// My Username
const username = 'yesh0907'

// HTMLRewritter object to transform static html page
const rewritter = new HTMLRewriter()
  .on('div#links', new LinksTransformer(links))
  .on('div#profile', new DisplayTransfomer())
  .on('img#avatar', new ProfileTransformer())
  .on('h1#name', new NameTransformer())

/**
 * JSON Response Handler for /links
 * @param {Request} request
 */
function jsonResponse(request) {
  // Set headers for response
  const init = {
    headers: { 'content-type': 'application/json' },
  }
  // Body of the response is JSON version of links array
  const body = JSON.stringify(links)

  // Respond to the request with the body and headers
  return new Response(body, init)
}

/**
 * Static HTML page handler with HTMLRewritting to add dynamic content
 * @param {Request} request
 */
async function htmlResponse(request) {
  // Fetch static html page from url with content-type as text/html
  const res = await fetch(staticHTMLUrl, {
    headers: {
      'Content-Type': 'text/html'
    }
  })
  // Respond to request with static html page rewritten with dynamic content
  return rewritter.transform(res)
}

/**
 * Route and respond accordingly
 * @param {Request} request
 */
async function handleRequest(request) {
  // Create routing object
  const r = new Router()

  // Routes type and routes to be added to routing object
  r.get('/', request => htmlResponse(request))
  r.get('/links', request => jsonResponse(request))

  // Respond with the appropriate response using the Router's route method
  const resp = await r.route(request)
  return resp
}

/** 
 * HTML Rewritter Transformers
 */
class LinksTransformer {
  constructor(links) {
      this.links = links
  }

  element(element) {
    // For every link, append link tag as html to the element
    this.links.forEach(link => {
        element.append(
            `<a href=${link.url}>${link.name}</a>`, { html: true }
        )
    })
  }
}

class DisplayTransfomer {
  element(element) {
    // Remove the display: none in the style attribute of the element
    element.setAttribute('style', '')
  }
}

class ProfileTransformer {
  element(element) {
    // Set the source of the element to the profile image
    element.setAttribute('src', profileImgSrc)
  }
}

class NameTransformer {
  element(element) {
    // Change the text of the element to the username
    element.setInnerContent(username)
  }
}

// Listen for any requests to the server and respond with the handle request method
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
