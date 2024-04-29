import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage/LoginPage.vue'
import DashboardPage from '@/pages/DashboardPage/DashboardPage.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginPage
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardPage
        },
    ]
})

export default router
