export const Typography = {
  //   fonts: { default: 'TomatoGrotesk', bold: 'TomatoGroteskBold', fallback: 'System' },
  fonts: { default: 'System', bold: 'System', fallback: 'System' },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const
  },
  sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, xxl: 22, xxxl: 24 }
}

export const defaultTextStyle = {
  fontFamily: Typography.fonts.bold,
  fontWeight: Typography.weights.medium
}
