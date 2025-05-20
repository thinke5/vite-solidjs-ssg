/* eslint-disable node/prefer-global/process */
import { defineConfig, logger, type RequestHandler, type SetupMiddlewaresServer } from '@rsbuild/core'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginLess } from '@rsbuild/plugin-less'
import { pluginSolid } from '@rsbuild/plugin-solid'
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin'
import { FRTrspackPlugin } from '@thinke/fsrouter'
import { UnoCSSRspackPlugin } from '@unocss/webpack/rspack'
import dayjs from 'dayjs'
import { generateHydrationScript } from 'solid-js/web'

const ENV = process.env
const NODE_ENV: string = process.env.NODE_ENV
const isDEV = NODE_ENV === 'development'
/** js、css等资源存储的 CDN */
const CDN_host = 'https://xxxxx.com' // TODO:使用实际域名
/** 项目的名称，会影响path前缀 */
const projectName = 'defaultProject' // TODO:使用实际项目
/** 项目的名称  */
const projectTitle = '示例项目' // TODO:使用实际项目名称
/** path前缀 */
const basePath = `/h/${projectName}`
/** 是否流水线 */
const isCI = Boolean(ENV.BK_CI_BUILD_NO)
/** 构建版本号 */
const build_version = isCI ? `${ENV.BK_CI_MAJOR_VERSION}.${ENV.BK_CI_MINOR_VERSION}.${ENV.BK_CI_FIX_VERSION}-${ENV.BK_CI_BUILD_NO}` : 'unknownVersion'

const ProjectConfig: any = defineConfig(({ envMode }) => {
  return {
    plugins: [pluginBabel(), pluginLess()],

    environments: {
      web: {
        plugins: [pluginSolid({ solidPresetOptions: { hydratable: true, generate: 'dom' } })],
        output: { target: 'web', manifest: true, minify: true, distPath: { root: 'dist/web' } },
        source: { entry: { index: './src/index' } },
        tools: {
          rspack: {
            resolve: { conditionNames: ['solid', NODE_ENV, 'module', 'import', 'require', 'default'] },
          },
        },
        server: { base: basePath },
      },
      ssr: {
        plugins: [pluginSolid({ solidPresetOptions: { hydratable: true, generate: 'ssr' } })],
        output: { minify: !false, polyfill: 'off', target: 'node', distPath: { root: 'dist/server' }, filename: { js: '[name].cjs' } },
        source: { entry: { index: './src/index.server', ssg: './src/index.ssg' } },
        tools: {
          rspack: { resolve: { conditionNames: ['solid', NODE_ENV, 'node', 'import', 'require', 'default'] } },
        },
      },
    },
    output: {
      assetPrefix: `${CDN_host}/H5-${envMode}/${projectName}/${build_version}`,
      polyfill: isDEV ? 'off' : 'usage',
    },
    html: {
      title: projectTitle,
      template: './index.html',
      crossorigin: 'anonymous',
      // inject: 'body',

    },
    source: {
      define: {
        'import.meta.env.PUBLIC__ProjectName': JSON.stringify(projectName),
        'import.meta.env.envMode': JSON.stringify(envMode),
        'import.meta.env.PUBLIC_BUILD_TIME': JSON.stringify(dayjs().format('YYYY-MM-DD HH:mm:ss')),
        'import.meta.env.PUBLIC_BUILD_V': JSON.stringify(!isDEV ? `${build_version}-${ENV.BK_CI_BUILD_NO}` : '0.0.0-dev'),
      },
    },
    server: {
      // host: 'mydev.qq.com',
      base: basePath,
      port: 18756,
      printUrls(params) {
        params.routes = params.routes.map((v) => {
          v.pathname = basePath
          return v
        })
        return params.urls
      },
      proxy: {
        '/bing': {
          target: 'https://bing.com',
          pathRewrite: { '^/bing': '' },
        },
      },
    },
    tools: {
      postcss: { postcssOptions: { plugins: [postcss_plugin_rpx2var()] } },
      rspack: {
        plugins: [
          FRTrspackPlugin(),
          UnoCSSRspackPlugin(),
          process.env.RSDOCTOR === 'true' && new RsdoctorRspackPlugin({ mode: 'brief', supports: { generateTileGraph: true } }),
        ],
        watchOptions: {
          ignored: /\.git|node_modules\/[^.]|node_modules\/\.pnpm/, // 默认的设置可能会影响虚拟模块，所以这里需要手动设置
        },
      },
    },
    dev: {
      setupMiddlewares: [
        ({ unshift }, serverAPI) => {
          const serverRenderMiddleware = serverRender(serverAPI)

          unshift(async (req, res, next) => {
            const urlInfo = new URL(req.url, 'http://localhost')

            if (req.method === 'GET' && !/\.(?:css|m?[jt]sx?|json5?|html|map|svg|jpe?g|png|webp|ttf|wav|mp[34]|aspx)$/.test(String(urlInfo.pathname))) {
              // console.log('req.url', urlInfo.pathname)
              try {
                await serverRenderMiddleware(req, res, next)
              }
              // eslint-disable-next-line unused-imports/no-unused-vars
              catch (err) {
                // logger.error('SSR render error, downgrade to CSR...\n', err);
                next()
              }
            }
            else {
              next()
            }
          })
        },
      ],
    },
  }
})
export default ProjectConfig

/** 将css文件里的`rpx`单位转为 `calc(var(--rpx)*$1)` 以适配移动端 */
function postcss_plugin_rpx2var() {
  let isExcludeFile = false
  return {
    postcssPlugin: 'postcss-plugin-rpx2var',
    Once(css) {
      const filePath = css.source.input.file
      isExcludeFile = filePath.includes('js-unocss-hash.css') // 排除unocss生成的文件
    },
    Declaration(decl) {
      if (isExcludeFile)
        return
      if (decl.value.includes('rpx')) {
        // decl.value = decl.value.replace(/([\d.]+)rpx/g, 'calc(var(--rpx)*$1)')
        decl.value = decl.value.replace(/([\d.]+)rpx/g, (_, v) => `${Number(v) / 16}rem`) // ! 这里的16不是固定值，需要根据项目实际调整
      }
    },
  }
}

/** dev时的ssr渲染 */
export function serverRender(serverAPI: SetupMiddlewaresServer): RequestHandler {
  return async (req, res, _next) => {
    const indexModule = await serverAPI.environments.ssr.loadBundle<{
      render: (url?: string) => string | Promise<string>
      renderHydrationScript: () => string
    }>('index')

    const markup = await indexModule.render(req.url)
    if (markup) {
      // const hs = indexModule.renderHydrationScript();
      const template = await serverAPI.environments.web.getTransformedHtml('index')

      const html = template
        .replace('<!--app-content-->', () => markup)
        .replace('</head>', () => `\n${generateHydrationScript()}\n</head>`)

      res.writeHead(200, {
        'Content-Type': 'text/html',
      })
      res.end(html)
    }
    else {
      _next()
    }
  }
}
