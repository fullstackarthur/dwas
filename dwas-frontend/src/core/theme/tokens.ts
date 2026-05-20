export const colors = {
  bgPrimary: '#1D2125',
  bgSecondary: '#22272B',
  bgTertiary: '#2C333A',
  borderPanel: '#3C444C',

  textPrimary: '#DEE4EA',
  textSecondary: '#9FADBC',
  textMuted: '#7D8B99',

  activeBlue: '#579DFF',
  successGreen: '#4BCE97',
  warningYellow: '#F5CD47',
  errorRed: '#F87168',
  infoCyan: '#6CC3E0',

  hoverSurface: '#313940',
  selectedSurface: '#3D4751',

  divider: 'rgba(255, 255, 255, 0.08)',
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
