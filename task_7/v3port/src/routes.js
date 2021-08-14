import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
    {
        path: "/",
        name: "List",
        component: () => import("@/views/List.vue")
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import("@/views/Profile.vue")
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import("@/views/Register.vue")
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
export default router;
