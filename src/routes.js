import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Switch from './views/home/Switch.vue'
import Time from './views/home/Time.vue'
import Button from './views/home/Button.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '开关控制',
        iconCls: 'fa el-icon-view',
        leaf: true,
        children: [
            { path: '/switch', component: Switch, name: '开关控制' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '定时控制',
        iconCls: 'fa el-icon-time',
        leaf: true,
        children: [
            { path: '/time', component: Time, name: '定时控制' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '按钮控制',
        iconCls: 'fa el-icon-star-off',
        leaf: true,
        children: [
            { path: '/button', component: Button, name: '按钮控制' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;