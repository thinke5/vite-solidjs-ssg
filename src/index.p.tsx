import { renderFullHTML } from './index.server'

(async () => {
  const html = await renderFullHTML('/demo/api')
  console.log(html)
})()
