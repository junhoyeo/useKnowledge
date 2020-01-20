import Typography from 'typography';

const typography = new Typography({
  baseFontSize: '18px',
  baseLineHeight: 1.45,
  headerFontFamily: ['Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
  bodyFontFamily: ['Noto Sans KR', 'sans-serif'],
  overrideThemeStyles: () => ({
    blockquote: {
      fontStyle: 'italic',
      borderLeft: '.25em solid rgba(102, 166, 255, 0.5)',
      marginLeft: 0,
      marginRight: 0,
      padding: '0 1rem',
    },
  }),
});

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
