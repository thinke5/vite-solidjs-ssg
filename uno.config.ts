import wmlPreset from '@thinke/unocss-wml-preset'
import { defineConfig, presetUno, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(), // base
    wmlPreset({
      autoRem: {
        pcCompatible: true,
        designWidth: 375,
        expectFontSize: 16,
      },
    }) as any, // 预设 & 移动rem兼容 && pc适配
  ],
  transformers: [
    transformerVariantGroup(), // text-(16 red)
  ],
  theme: {
    colors: {},
  },
})
