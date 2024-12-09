import facepaint from 'facepaint'

export const breakpoints = [
  576, // 0
  768, // 1
  1024, // 2
  1280, // 3
]
export const mediaQuery = breakpoints.map((bp) => `@media (min-width: ${bp}px)`)
export const mediaQueries = facepaint(mediaQuery, { overlap: true })

const config = {
  primaryColor: 'rgba(2, 0, 71, 1)', // #020047
  primaryColorTransparent: 'rgba(10, 14, 77, 0.3)',
  secondaryColor: 'rgba(20, 122, 165, 1)', // #147aa5
  secondaryColorTransparent: 'rgba(20,122,165, 0.35)',
  accentColorStrong: '#15f1ff',
  accentColorWeak: '#205088',
  accentColorTransparent: 'rgba(21, 241, 255, 0.4)',

  lightContrastColor: '#F2F2F2',
  lightContrastColorWeak: '#bbbbbb',
  darkContrastColor: '#0e1014',
  lightTransparentColor: `rgba(255, 255, 255, 0.1)`,
  semiLightTransparentColor: `rgba(255, 255, 255, 0.2)`,

  successColor: '#198754',
  infoColor: '#141270',
  inactiveColor: '#9d9ccc',
  warningColor: '#ffc107',
  errorColor: '#dc3545',

  xsFontsize: '14px',
  smFontsize: '16px',
  mdFontsize: '20px',
  lgFontsize: '26px',
  xlFontsize: '34px',

  xxsSpacing: '4px',
  xsSpacing: '6px',
  smSpacing: '8px',
  mdSpacing: '12px',
  lgSpacing: '16px',
  xlSpacing: '24px',
  xxlSpacing: '32px',
  maxSpacing: '46px',

  xsRadius: '0px',
  smRadius: '4px',
  mdRadius: '8px',
  lgRadius: '12px',
  xlRadius: '24px',
  xxlRadius: '42px',
  xxxlRadius: '58px',
  maxRadius: '999px',

  xsBorder: '1px solid',
  smBorder: '2px solid',
  mdBorder: '4px solid',
}

export const tokens = {
  color: {
    // GENERAL
    primary: `${config.primaryColor}`,
    primaryTransparent: `${config.primaryColorTransparent}`,
    secondary: `${config.secondaryColor}`,
    secondaryTransparent: `${config.secondaryColorTransparent}`,
    accentStrong: `${config.accentColorStrong}`,
    accentWeak: `${config.accentColorWeak}`,
    accentTransparent: `${config.accentColorTransparent}`,

    contrastLight: `${config.lightContrastColor}`,
    contrastLightWeak: `${config.lightContrastColorWeak}`,
    contrastDark: `${config.darkContrastColor}`,
    transparentLight: `${config.lightTransparentColor}`,
    semiTransparentLight: `${config.semiLightTransparentColor}`,
    transparent: `rgba(0, 0, 0, 0)`,

    success: `${config.successColor}`,
    info: `${config.infoColor}`,
    inactive: `${config.inactiveColor}`,
    warning: `${config.warningColor}`,
    error: `${config.errorColor}`,

    // SPECIFIC
    titleColor: `${config.lightContrastColor}`,
    paragraphColor: `${config.lightTransparentColor}`,
  },

  spacing: {
    xs: `${config.xsSpacing}`,
    sm: `${config.smSpacing}`,
    md: `${config.mdSpacing}`,
    lg: `${config.lgSpacing}`,
    xl: `${config.xlSpacing}`,
    xxl: `${config.xxlSpacing}`,
    max: `${config.maxSpacing}`,
  },

  font: {
    fontSize: {
      xs: `${config.xsFontsize}`,
      sm: `${config.smFontsize}`,
      md: `${config.mdFontsize}`,
      lg: `${config.lgFontsize}`,
      xl: `${config.xlFontsize}`,
    },
    fontWeight: {
      thin: '100',
      light: '300',
      regular: '400',
      medium: '500',
      bold: '700',
      black: '900',
    },
    fontFamily: {
      sans: ['"source sans pro"', 'helvetica', 'arial', 'sans-serif'],
      mono: ['"source code pro"', 'monospace'],
    },
  },

  letterSpacing: {
    normal: '0',
    wide: '0.2px',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    normal: '1.5',
    loose: '2',
  },

  position: {
    static: 'static',
    relative: 'relative',
    absolute: 'absolute',
    fixed: 'fixed',
    sticky: 'sticky',
  },
  positionValue: {
    top: '',
    bottom: '',
    left: '',
    right: '',
  },

  border: {
    xs: `${config.xsBorder}`,
    sm: `${config.smBorder}`,
    md: `${config.mdBorder}`,
  },
  borderRadius: {
    default: `${config.maxRadius}`,
    none: '0',
    xs: `${config.xsRadius}`,
    sm: `${config.smRadius}`,
    md: `${config.mdRadius}`,
    lg: `${config.lgRadius}`,
    xl: `${config.xlRadius}`,
    xxl: `${config.xxlRadius}`,
    xxxl: `${config.xxxlRadius}`,
    max: `${config.maxRadius}`,
    round: '50%',
  },

  size: {
    large: 'large',
    medium: 'medium',
    small: 'small',
  },
  maxWidth: {
    sm: '544px',
    md: '768px',
    lg: '1012px',
    xl: '1280px',
  },

  listStyleType: {
    none: 'none',
    disc: 'disc',
    decimal: 'decimal',
  },

  // Specifics
  navHeight: {
    sm: '60px',
    md: '72px',
    lg: '100px',
  },
}
