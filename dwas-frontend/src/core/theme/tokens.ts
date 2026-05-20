export const colors = {
  bgPrimary: '#F4F5F7',
  bgSecondary: '#FFFFFF',
  bgTertiary: '#FAFBFC',
  borderPanel: '#DFE1E6',

  textPrimary: '#172B4D',
  textSecondary: '#44546F',
  textMuted: '#6B778C',

  activeBlue: '#0052CC',
  successGreen: '#36B37E',
  warningYellow: '#FFAB00',
  errorRed: '#DE350B',
  infoCyan: '#00B8D9',

  hoverSurface: '#EBECF0',
  selectedSurface: '#DEEBFF',

  divider: 'rgba(9, 30, 66, 0.13)',
} as const

export const spacing = {
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const

export const typography = {
  metadata: '11px',
  metadataSm: '12px',
  body: '13px',
  bodyBase: '14px',
  panelTitle: '16px',
  sectionTitle: '18px',
  pageTitle: '24px',
} as const

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '10px',
} as const

export const motion = {
  fast: '120ms ease',
  normal: '180ms ease',
} as const

export const zIndex = {
  sidebar: 100,
  topbar: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
  commandPalette: 600,
} as const

export const layout = {
  sidebarWidth: '240px',
  sidebarCollapsedWidth: '56px',
  rightSidebarWidth: '320px',
  topbarHeight: '48px',
} as const
