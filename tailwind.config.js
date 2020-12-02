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
        gray2: '#4F4F4F',
        gray3: '#828282',
        gray4: '#BDBDBD',
        gray5: '#F6F8FB',
        boardBg: '#F8F9FD',
        'light-blue': '#F6F8FB',
        'blue-btn': '#DAE4FD',
        'gray-border': '#E0E0E0'
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        input: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
      width: {
        container: '400px',
        containerBig: '800px',
        list: '250px',
        taskModal: '660px'
      },
      height: {
        "board": "calc(100vh - 64px)"
      },
      maxWidth: {
        container: '1180px',
        taskModal: '660px'
      },
      gridAutoColumns: {
        'list': '250px',
      }
    },
  },
  variants: {
    opacity: ['responsive', 'hover', 'focus', 'group-hover']
  },
  plugins: [],
}