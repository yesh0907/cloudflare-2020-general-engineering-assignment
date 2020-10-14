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
// My Name
const name = "Yesh Chandiramani"
// New Bg color class from Tailwind CSS
const bgColorClass = "bg-purple-400"

// HTMLRewritter object to transform static html page
const rewritter = new HTMLRewriter()
  .on('title', new TitleTransformer()) // Extra Credit
  .on('body', new BgColorTransformer()) // Extra Credit
  .on('div#links', new LinksTransformer(links))
  .on('div#profile, div#social', new DisplayTransformer()) // div#social is Extra Credit
  .on('div#social', new TwitterSocialTransformer())
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

class DisplayTransformer {
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

// Extra Credit
class TwitterSocialTransformer {
  // Add Twitter SVG and link to Twitter
  element(element) {
    element.append(
      `<a href="https://twitter.com">
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter icon</title><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"></path></svg>
      </a>`, { html: true }
    )
  }
}

// Extra Credit
class TitleTransformer {
  element(element) {
    // Change the text of the title to the name
    element.setInnerContent(name)
  }
}

// Extra Credit
class BgColorTransformer {
  element(element) {
    // Set the class to new bg color class
    element.setAttribute('class', bgColorClass)
  }
}

// Listen for any requests to the server and respond with the handle request method
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
