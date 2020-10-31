module.exports = {
  purge: {
    enabled: false,
    content: [
      './src/**/*.html',
      './src/**/*.js',
      './src/**/*.jsx',
      './src/**/*.ts',
      './src/**/*.tsx',
      './public/index.html',
    ],
  },
  theme: {
    fontFamily: {
      sans: ['Noto Sans', 'sans-serif'],
    },
    extend: {
      colors: {
        blue: '#2F80ED',
        'blue-darker': '#256ccc',
        green: '#219653',
        white: '#FFFFFF',
        danger: '#f44336',
        gray1: '#F2F2F2',
        gray2: '#E0E0E0',
        gray3: '#828282',
        gray4: '#BDBDBD',
        gray5: '#F6F8FB',
        'light-blue': '#F6F8FB',
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      },
      width: {
        container: '400px',
        containerBig: '800px',
      },
      maxWidth: {
        container: '1180px'
      }
    },
  },
  variants: {},
  plugins: [],
}