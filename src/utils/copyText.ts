import toast from '@thinke/toast'

//  本地的https 可以使用 import basicSsl from '@vitejs/plugin-basic-ssl'

/**
 * 复制文本到粘贴板
 * @error `http访问`的网站会被浏览器拦截 无法复制
 */
export async function copyText(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text).catch (() => copyTextIE(text))
  }
  else {
    copyTextIE(text)
  }
  // 检查协议是否为http
  if (document.location.protocol === 'http:') {
    toast.warn('当前页面为http访问,可能无法复制')
  }
  else {
    toast.success('复制成功')
  }
}

/**
 * 复制文本到粘贴板,IE兼容
 * @error `http访问`的网站会被浏览器拦截 无法复制
 */
function copyTextIE(text: string) {
  const textarea = document.createElement('textarea')
  document.body.appendChild(textarea)
  // 隐藏此输入框
  textarea.style.position = 'fixed'
  textarea.style.clip = 'rect(0 0 0 0)'
  textarea.style.top = '10px'
  // 赋值
  textarea.value = text
  // 选中
  textarea.select()
  // 复制
  document.execCommand('copy', true)
  // 移除输入框
  document.body.removeChild(textarea)
}
