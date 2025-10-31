
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        
        sans: [
          'Pretendard',
          'Noto Sans KR',
          'Apple SD Gothic Neo',
          'system-ui',
          'sans-serif'
        ],
        ria:[
          'Ria'
        ]
      },
      colors:{
        backcolor:"#525461",
        primary:"#1794F6"
      }
    },
  },
  plugins: [],
}

