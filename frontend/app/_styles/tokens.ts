import facepaint from 'facepaint'

export const breakpoints = [
  '576', // 0
  '768', // 1
  '1024', // 2
  '1280', // 3
]
export const mediaQuery = breakpoints.map((bp) => `@media (min-width: ${bp}px)`)
export const mediaQueries = facepaint(mediaQuery, { overlap: true })

export const config = {
  primary: 'rgb(66, 66, 66)',
  primaryWeak: 'rgb(40,44,47)',
  primaryWeaker: 'rgb(20,22,24)',
  primaryTransparent: '',
  primaryContrast: '',
  primaryContrastWeak: '',
  primaryBorder: 'rgb(88, 88, 88)',

  secondary: 'rgb(215,212,207)',
  secondaryWeak: 'rgb(172, 172, 172)',
  secondaryWeaker: 'rgb(138, 138, 138)',
  secondaryWeakest: 'rgb(120, 120, 120)',
  secondaryTransparent: '',
  secondaryContrast: '',
  secondaryContrastWeak: '',

  accent: 'rgb(185, 252, 0)',
  accentWeak: '',
  accentTransparent: '',

  transparent: `rgba(255, 255, 255, 0.1)`,
  transparentWeak: `rgba(255, 255, 255, 0.2)`,

  success: 'rgb(185, 252, 0)',
  info: '#141270',
  inactive: '#9d9ccc',
  warning: 'rgb(255, 207, 75)',
  error: '#dc3545',

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
    primary: `${config.primary}`,
    primaryWeak: `${config.primaryWeak}`,
    primaryWeaker: `${config.primaryWeaker}`,
    primaryTransparent: `${config.primaryTransparent}`,
    primaryContrast: `${config.primaryContrast}`,
    primaryContrastWeak: `${config.primaryContrastWeak}`,
    primaryBorder: `${config.primaryBorder}`,

    secondary: `${config.secondary}`,
    secondaryWeak: `${config.secondaryWeak}`,
    secondaryWeaker: `${config.secondaryWeaker}`,
    secondaryWeakest: `${config.secondaryWeakest}`,
    secondaryTransparent: `${config.secondaryTransparent}`,
    accent: `${config.accent}`,

    accentWeak: `${config.accentWeak}`,
    accentTransparent: `${config.accentTransparent}`,

    contrastDark: `${config.secondaryContrast}`,
    contrastDarkWeak: `${config.secondaryContrastWeak}`,

    transparentLight: `${config.transparent}`,
    semiTransparentLight: `${config.transparentWeak}`,

    success: `${config.success}`,
    info: `${config.info}`,
    inactive: `${config.inactive}`,
    warning: `${config.warning}`,
    error: `${config.error}`,

    // SPECIFIC
    title: `${config.primaryContrast}`,
    paragraph: `${config.primaryContrastWeak}`,
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
