/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // App default: Pretendard (logo는 font-ria 사용)
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

