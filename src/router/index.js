/**
 * * Vue3 라우터 설정 파일
 **/
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

const routes = [];

export const router = createRouter({
  // histroy mode : 깔끔한 URL 사용
  history: createWebHistory(import.meta.env.BASE_URL),
  // 배열 routes
  routes,
  // 페이지 전환 시 항상 최상단으로 스크롤
  scrollBehavior() {
    return { top: 0 };
  },
});
