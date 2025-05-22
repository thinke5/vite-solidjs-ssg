import wmlPreset from '@thinke/unocss-wml-preset'
import { defineConfig, presetWind3, transformerVariantGroup } from 'unocss'
import presetAnimations from 'unocss-preset-animations'

export default defineConfig({
  presets: [
    presetAnimations(),
    presetWind3(), // base
    wmlPreset({
      autoRem: {
        pcCompatible: true,
        designWidth: 375,
        expectFontSize: 16,
      },
    }) as any, // 预设 & 移动rem兼容 && 移动端向pc适配
  ],
  transformers: [
    transformerVariantGroup(), // text-(16 red)
  ],
  theme: {
    colors: {
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
    },
    borderRadius: {
      lg: `var(--radius)`,
      md: `calc(var(--radius) - 2px)`,
      sm: 'calc(var(--radius) - 4px)',
    },
    animation: {
      keyframes: {
        'accordion-down':
          '{ from { height: 0 } to { height: var(--kb-accordion-content-height) } }',
        'accordion-up': '{ from { height: var(--kb-accordion-content-height) } to { height: 0 } }',
        'collapsible-down':
          '{ from { height: 0 } to { height: var(--kb-collapsible-content-height) } }',
        'collapsible-up':
          '{ from { height: var(--kb-collapsible-content-height) } to { height: 0 } }',
      },
      timingFns: {
        'accordion-down': 'ease-out',
        'accordion-up': 'ease-out',
        'collapsible-down': 'ease-out',
        'collapsible-up': 'ease-out',
      },
      durations: {
        'accordion-down': '0.2s',
        'accordion-up': '0.2s',
        'collapsible-down': '0.2s',
        'collapsible-up': '0.2s',
      },
    },
  },
})
