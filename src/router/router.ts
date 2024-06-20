import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage/LoginPage.vue'
import ServerPage from '@/pages/ServerPage/ServerPage.vue'
import ParentRouterView from '@/components/ParentRouterView.vue'
import ServerCreatePage from '@/pages/ServerPage/pages/ServerCreatePage/ServerCreatePage.vue'
import ServerUpdatePage from '@/pages/ServerPage/pages/ServerUpdatePage/ServerUpdatePage.vue'
import RulesPage from '@/pages/RulesPage/RulesPage.vue'
import RecipientsPage from '@/pages/RecipientsPage/RecipientsPage.vue'
import TransportPage from '@/pages/TransportPage/TransportPage.vue'
import RelayDomainPage from '@/pages/RelayDomains/RelayDomainPage.vue'
import MilterDefinitionsPage from '@/pages/MilterDefinitionsPage/MilterDefinitionsPage.vue'
import MilterExceptionsPage from '@/pages/MilterExceptionsPage/MilterExceptionsPage.vue'
import UserManagementPage from '@/pages/UserManagementPage/UserManagementPage.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginPage
        },
        {
            path: '/users',
            name: 'users',
            component: UserManagementPage
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
        },
        {
            path: '/policy/rules',
            component: RulesPage,
            name: 'policy.rules.index',
        },
        {
            path: '/policy/recipients',
            component: RecipientsPage,
            name: 'policy.recipients.index',
        },
        {
            path: '/policy/transports',
            component: TransportPage,
            name: 'policy.transports.index',
        },
        {
            path: '/policy/relay-domains',
            component: RelayDomainPage,
            name: 'policy.relay-domains.index',
        },
        {
            path: '/policy/milter',
            component: MilterDefinitionsPage,
            name: 'policy.milter.index',
        },
        {
            path: '/policy/milter/exceptions',
            component: MilterExceptionsPage,
            name: 'policy.milter.exceptions'
        }
    ]
})

export default router
