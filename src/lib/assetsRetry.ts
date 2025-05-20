// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import assetsRetryUMD from 'assets-retry/dist/assets-retry.umd.js'

/** 资源失败自动重试，并兼容低版本的webp */
export function assetsRetry() {
  // 低版本兼容webp
  assetsRetryUMD({
    // domain list, only resources in the domain list will be retried.
    domain: ['tmga-resource.tmgv.qq.com', 'tmga-resource-1300342614.file.myqcloud.com'],
    // maximum retry count for each asset, default is 3
    maxRetryCount: 2,
    // onRetry hook is how you can customize retry logic with, default is x => x
    onRetry(currentUrl: string, originalUrl: string, statistics: { retryTimes: number }) {
      if (originalUrl.endsWith('.webp')) {
        return `${originalUrl}?imageMogr2/format/png`
      }
      return currentUrl
    },

    // onSuccess(currentUrl) {
    //   console.log(currentUrl, assetsRetryStatistics[currentUrl])
    // },
    // onFail(currentUrl) {
    //   console.log(currentUrl, assetsRetryStatistics[currentUrl])
    // },
  })
}
