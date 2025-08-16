// Theme configuration for consistent styling across the application

export const theme = {
  colors: {
    primary: '#d4af37',
    primaryDark: '#b38f1d',
    primaryLight: '#e6c757',
    secondary: '#000000',
    accent: '#f8f9fa',
    
    background: {
      main: '#ffffff',
      dark: '#000000',
      light: '#fefefe',
      card: '#ffffff',
      cardDark: '#000000',
    },
    
    text: {
      primary: '#000000',
      secondary: '#666666',
      muted: '#999999',
      light: '#ffffff',
      gold: '#d4af37',
    },
    
    border: {
      default: '#e0e0e0',
      gold: '#d4af37',
    },
    
    status: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.2)',
    gold: '0 4px 20px rgba(212, 175, 55, 0.3)',
  },
  
  transitions: {
    fast: '0.15s ease',
    normal: '0.25s ease',
    slow: '0.35s ease',
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  
  typography: {
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  }
} as const;

// Helper functions for theme usage
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = theme.colors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return '#000000';
  }
  
  return value;
};

export const getSpacing = (size: keyof typeof theme.spacing) => {
  return theme.spacing[size];
};

export const getShadow = (size: keyof typeof theme.shadows) => {
  return theme.shadows[size];
};

// CSS-in-JS style objects for common patterns
export const commonStyles = {
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.md,
    padding: theme.spacing.xl,
    border: `1px solid ${theme.colors.border.default}`,
    transition: `all ${theme.transitions.normal}`,
  },
  
  cardDark: {
    backgroundColor: theme.colors.background.cardDark,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.md,
    padding: theme.spacing.xl,
    border: `1px solid ${theme.colors.border.gold}`,
    color: theme.colors.text.light,
    transition: `all ${theme.transitions.normal}`,
  },
  
  button: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.secondary,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    fontWeight: theme.typography.fontWeight.semibold,
    cursor: 'pointer',
    transition: `all ${theme.transitions.normal}`,
    boxShadow: theme.shadows.sm,
  },
  
  input: {
    backgroundColor: theme.colors.background.light,
    color: theme.colors.text.primary,
    border: `2px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: theme.typography.fontSize.base,
    transition: `all ${theme.transitions.normal}`,
    width: '100%',
  },
  
  pageContainer: {
    minHeight: 'calc(100vh - 64px)',
    padding: `${theme.spacing.xl} ${theme.spacing.md}`,
    backgroundColor: theme.colors.background.main,
  },
  
  pageTitle: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center' as const,
    marginBottom: theme.spacing['2xl'],
  }
};

export default theme;