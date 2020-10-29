module.exports = {
  purge: {
    enabled: true,
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
      sans: ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        blue: '#2F80ED',
        'blue-darker': '#256ccc',
        green: '#219653',
        white: '#FFFFFF',
        danger: '#f44336',
        'light-gray': '#FAFAFB',
        gray2: '#4F4F4F',
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
    },
  },
  variants: {},
  plugins: [],
}