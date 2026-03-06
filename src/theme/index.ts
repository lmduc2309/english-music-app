export const colors = {
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#4834D4',
  secondary: '#00CEC9',
  secondaryLight: '#81ECEC',
  accent: '#FD79A8',
  accentLight: '#FDCBDF',

  success: '#00B894',
  warning: '#FDCB6E',
  error: '#E17055',
  info: '#74B9FF',

  background: '#0F0F23',
  surface: '#1A1A2E',
  surfaceLight: '#252547',
  card: '#16213E',

  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0CC',
  textMuted: '#6C6C8A',
  textDark: '#1A1A2E',

  border: '#2A2A4A',
  divider: '#1E1E3A',

  levelA1: '#00B894',
  levelA2: '#00CEC9',
  levelB1: '#6C5CE7',
  levelB2: '#A29BFE',
  levelC1: '#FD79A8',
  levelC2: '#E17055',

  scorePerfect: '#FFD700',
  scoreGreat: '#00B894',
  scoreGood: '#6C5CE7',
  scoreFail: '#E17055',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  title: 32,
  hero: 40,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const getLevelColor = (level: string) => {
  const map: Record<string, string> = {
    A1: colors.levelA1,
    A2: colors.levelA2,
    B1: colors.levelB1,
    B2: colors.levelB2,
    C1: colors.levelC1,
    C2: colors.levelC2,
  };
  return map[level] || colors.primary;
};

export const getScoreColor = (score: number) => {
  if (score >= 95) return colors.scorePerfect;
  if (score >= 80) return colors.scoreGreat;
  if (score >= 60) return colors.scoreGood;
  return colors.scoreFail;
};
