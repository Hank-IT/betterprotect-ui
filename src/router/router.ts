import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage/LoginPage.vue'
import DashboardPage from '@/pages/DashboardPage/DashboardPage.vue'
import ServerPage from '@/pages/ServerPage/ServerPage.vue'
import ParentRouterView from '@/components/ParentRouterView.vue'
import ServerCreatePage from '@/pages/ServerPage/pages/ServerCreatePage/ServerCreatePage.vue'
import ServerUpdatePage from '@/pages/ServerPage/pages/ServerUpdatePage/ServerUpdatePage.vue'

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
        {
            path: '/server',
            component: ParentRouterView,
            children: [
                {
                    path: '',
                    component: ServerPage,
                    name: 'server.index'
                },
                {
                    path: 'create',
                    component: ServerCreatePage,
                    name: 'server.create',
                },
                {
                    path: ':id/edit',
                    component: ServerUpdatePage,
                    name: 'server.edit',
                    props: true
                }
            ]
        }
    ]
})

export default router
