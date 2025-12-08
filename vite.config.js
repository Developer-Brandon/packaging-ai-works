import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 1. 경로(모듈) 관련 설정
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 2. 개발 서버 설정
  server: {
    // 개발 서버 포트
    port: 5173,
    // 자동으로 브라우저 열기
    open: true,
    // CORS 설정 (추후 백엔드 연동 시 필요)
    proxy: {
      // '/api'로 시작하는 요청은 백엔드로 전달
      "/api": {
        target: "http://localhost:5173", // 백엔드 서버 주소 (나중에 변경)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  // 3. 빌드 설정
  build: {
    outDir: "dist", // 빌드 결과물 출력 폴더
    sourcemap: true, // 소스맵 생성 (디버깅 용이) -> 추후 삭제 예정
    minify: "terser", // 코드 최소화
  },
});
