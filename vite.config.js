import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages에서 서브패스(/attend-app/)로 서비스되므로 base를 설정합니다.
  // 사용자/오너명이 Dayeon-T이고 저장소명이 attend-app인 경우 필수.
  base: '/attend-app/',
  plugins: [react()],
})
