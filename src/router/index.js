Vue.use(VueRouter)
import Vue from 'vue'
import VueRouter from 'vue-router'
import Cars from '../views/Cars'
import Sucursales from '../views/Sucursales'

const routes = [
    {
        path: '/cars',
        name: 'cars',
        component: Cars
    },
    {
        path: '/sucursales',
        name: 'sucursales',
        component: Sucursales
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
