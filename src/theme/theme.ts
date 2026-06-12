export const theme = {
  colors: {
    background: '#F6F8E2',       // Light cream/beige from the screens
    primary: '#556B2F',          // Deep olive green from the designs
    primaryDark: '#3A4B20',      // Deeper olive for active press states
    primaryLight: '#EEF2D3',     // Soft light olive green for card backgrounds
    primaryLightActive: '#DCE2B7', // Highlight color for active selectable cards
    textDark: '#1E2512',         // Near black/dark olive for readability
    textMuted: '#5F694D',        // Muted gray-green for subtexts
    cardBg: '#EEF2D3',           // Soft card background color
    white: '#FFFFFF',
    border: '#D0D8AC',
    activeCheck: '#556B2F',
    accentGold: '#EAD9C9',       // Light elegant gold for VIP/Premium aspects
    accentGoldDark: '#B28E66',
    danger: '#D9534F',
    dangerBg: '#FDF2F2'
  },
  typography: {
    fontFamily: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 22,
      xxl: 28,
      xxxl: 36
    },
    weights: {
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      black: '800' as const
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    round: 999
  },
  shadows: {
    light: {
      shadowColor: '#556B2F',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2
    },
    medium: {
      shadowColor: '#556B2F',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4
    }
  }
};
