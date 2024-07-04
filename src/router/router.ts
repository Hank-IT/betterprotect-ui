import {createRouter, createWebHistory} from 'vue-router'
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
import LogPage from '@/pages/LogPage/LogPage.vue'
import LogDetailPage from '@/pages/LogPage/LogDetailPage.vue'
import RawLogPage from '@/pages/LogPage/components/RawLogPage.vue'
import ServerQueuePage from '@/pages/ServerPage/pages/ServerQueuePage/ServerQueuePage.vue'
import ServerLogPage from '@/pages/ServerPage/pages/ServerLogPage/ServerLogPage.vue'

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
                },
                {
                    path: ':id/queue',
                    component: ServerQueuePage,
                    name: 'server.queue',
                    props: true,
                },
                {
                    path: ':id/log',
                    component: ServerLogPage,
                    name: 'server.log',
                    props: true,
                }
            ]
        },
        {
            path: '/logging',
            component: ParentRouterView,
            children: [
                {
                    path: '',
                    component: LogPage,
                    name: 'logging.index',
                },
                {
                    path: ':id',
                    component: LogDetailPage,
                    name: 'logging.details',
                    props: true,
                }, {
                    path: 'raw',
                    component: RawLogPage,
                    name: 'logging.raw',
                    props: route => ({ search: route.query.search, start_date: route.query.start_date, end_date: route.query.end_date })
                },
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
