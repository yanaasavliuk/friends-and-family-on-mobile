import { createRouter, createWebHistory } from 'vue-router'

const DevicePreview = () => import('./experiments/DevicePreview.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: DevicePreview },
  ],
})

export default router
