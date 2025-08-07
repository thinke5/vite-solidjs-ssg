import type { Connect } from 'vite'
import { renderFullHTML } from './index.server'

const handler: Connect.NextHandleFunction = async (req, res) => {
  // console.log({ url: req.url, ourl: req.originalUrl })

  const htmlStr = await renderFullHTML(req.originalUrl)

  res.setHeader('content-type', 'text/html').end(htmlStr)
}

export default handler
