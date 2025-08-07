/* eslint-disable ts/ban-ts-comment */
import type { Connect, Plugin, PluginOption } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import legacy from '@vitejs/plugin-legacy'
import dayjs from 'dayjs'
import { visualizer } from 'rollup-plugin-visualizer'
import Unocss from 'unocss/vite'
import { createServerModuleRunner, defineConfig, perEnvironmentPlugin } from 'vite'
import Solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'

// eslint-disable-next-line node/prefer-global/process
const ENV = process.env
const NODE_ENV = ENV.NODE_ENV as string
const isDEV = NODE_ENV === 'development'

/** 是否流水线 */
const isCI = Boolean(ENV.BK_CI_BUILD_NO)
/** 构建版本号 */
const build_version = isCI ? `${ENV.BK_CI_MAJOR_VERSION}.${ENV.BK_CI_MINOR_VERSION}.${ENV.BK_CI_FIX_VERSION}-${ENV.BK_CI_BUILD_NO}` : 'unknownVersion'
/** js、css等资源存储的 CDN */
const CDN_host = 'https://cdn.cdn' // TODO:使用实际域名
/** 项目的名称，会影响path前缀 */
const projectName = 'defaultProject' // TODO:使用实际项目
/** path前缀 */
const basePath = `/h/${projectName}`

export default defineConfig(({ command, mode }) => {
  const CDN_path = `${CDN_host}/H5-${mode}/${projectName}/${build_version}`
  const isBuild = command === 'build'

  return ({
    base: command === 'serve' ? basePath : CDN_path, // TODO:按需启用
    define: {
      'import.meta.env.PUBLIC_BUILD_TIME': JSON.stringify(dayjs().format('YYYY-MM-DD HH:mm:ss')),
      'import.meta.env.PUBLIC_BUILD_V': JSON.stringify(!isDEV ? `${build_version}-${ENV.BK_CI_BUILD_NO}` : '0.0.0-dev'),
      'import.meta.env.PUBLIC_BASE_PATH': JSON.stringify(basePath),
    },
    clearScreen: false,
    appType: 'custom',
    plugins: [
      Unocss(),
      tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
      tsconfigPaths(),
      Solid({ ssr: true }),
      vitePluginSsrMiddleware({
        entry: '/src/index.dev.ssr.tsx',
        // @ts-expect-error
        preview: new URL('./dist/server/index.js', import.meta.url).toString(),
      }),
      isBuild && legacy({ modernPolyfills: true, renderLegacyChunks: false }),
      perEnvironmentPlugin('only-client', environment => environment.name === 'client' && [
        isBuild && visualizer(),
      ]),
    ],
    // resolve: {
    //   noExternal: true,
    // },
    environments: {
      client: {
        build: {
          manifest: true,
          ssrManifest: true,
          // sourcemap: true,
          outDir: 'dist/client',
        },
      },
      ssr: {
        optimizeDeps: {
          exclude: ['@tanstack/*'],
        },
        build: {
          // sourcemap: true,
          outDir: 'dist/server',
          ssr: true,
          rollupOptions: {
            input: {
              index: '/src/index.dev.ssr.tsx',
              ssg: '/src/index.ssg.tsx',
              ssp: '/src/index.p.tsx',
            },
          },
        },

      },
    },
    css: {
      postcss: {
        plugins: [postcss_plugin_rpx2var()],
      },
    },
    builder: {
      async buildApp(builder) {
        await builder.build(builder.environments.client)
        await builder.build(builder.environments.ssr)
      },
    },
    server: {
      open: true,
      port: 25078,
      // host: '0.0.0.0',
      proxy: {
        '/bing': {
          target: 'https://bing.com',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/bing/, ''),
        },
      },
    },
  })
})

// ------------------------------

/** vavite-style ssr middleware plugin */
export function vitePluginSsrMiddleware({
  entry,
  preview,
}: {
  entry: string
  preview?: string
}): PluginOption {
  const plugin: Plugin = {
    name: vitePluginSsrMiddleware.name,

    configureServer(server) {
      // dev开发时，将server挂载到globalThis上
      Object.assign(globalThis, { __globalServer: server })
      // 变更html
      const runner = createServerModuleRunner(server.environments.ssr, { hmr: { logger: false } })
      const importWithRetry = async () => {
        try {
          return await runner.import(entry)
        }
        catch (e) {
          if (
            e instanceof Error
            && (e as any).code === 'ERR_OUTDATED_OPTIMIZED_DEP'
          ) {
            runner.clearCache()
            return await importWithRetry()
          }
          throw e
        }
      }
      const handler: Connect.NextHandleFunction = async (req, res, next) => {
        try {
          const mod = await importWithRetry()
          await mod.default(req, res, next)
        }
        catch (e) {
          next(e)
        }
      }
      return () => server.middlewares.use(handler)
    },

    async configurePreviewServer(server) {
      if (preview) {
        const mod = await import(preview)
        return () => server.middlewares.use(mod.default)
      }
    },
  }
  return [plugin]
}

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
        decl.value = decl.value.replace(/([\d.]+)rpx/g, 'calc(var(--rpx)*$1)')
      }
    },
  }
}
