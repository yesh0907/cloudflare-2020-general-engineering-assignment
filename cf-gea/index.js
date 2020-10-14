const Router = require('./router')

const links = [
  {"name": "Facebook", "url": "https://facebook.com"}, 
  {"name": "Instagram", "url": "https://instagram.com"},
  {"name": "Github", "url": "https://github.com"}
]
const staticHTMLUrl = 'https://static-links-page.signalnerve.workers.dev'
const profileImgSrc = 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Round&hairColor=BrownDark&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Brown'
const username = 'yesh0907'

const rewritter = new HTMLRewriter()
  .on('div#links', new LinksTransformer(links))
  .on('div#profile', new DisplayTransfomer())
  .on('img#avatar', new ProfileTransformer())
  .on('h1#name', new NameTransformer())

function jsonResponse(request) {
  const init = {
    headers: { 'content-type': 'application/json' },
  }
  const body = JSON.stringify(links)

  return new Response(body, init)
}

async function htmlResponse(request) {
  const res = await fetch(staticHTMLUrl, {
    headers: {
      'Content-Type': 'text/html'
    }
  })

  return rewritter.transform(res)
}

/**
 * Route and respond accordingly
 * @param {Request} request
 */
async function handleRequest(request) {
  const r = new Router()

  r.get('/', request => htmlResponse(request))
  r.get('/links', request => jsonResponse(request))

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
      this.links.forEach(link => {
          element.append(
              `<a href=${link.url}>${link.name}</a>`, { html: true }
          )
      })
  }
}

class DisplayTransfomer {
  element(element) {
    element.setAttribute('style', '')
  }
}

class ProfileTransformer {
  element(element) {
    element.setAttribute('src', profileImgSrc)
  }
}

class NameTransformer {
  element(element) {
    element.setInnerContent(username)
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
