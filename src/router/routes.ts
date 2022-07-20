import LoginPage from "src/pages/LoginPage.vue";
import ProfilePage from "src/pages/ProfilePage.vue";
import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Default",
        redirect: "/login",
    },
    {
        path: "/login",
        name: "Login",
        component: () => LoginPage,
    },
    {
        path: "/home",
        name: "Home",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                name: "Index",
                component: () => import("pages/IndexPage.vue"),
            },
            {
                path: "profile",
                name: "Profile",
                component: () => import("pages/ProfilePage.vue"),
            },
            {
                path: "reception",
                name: "Reception",
                component: () => import("pages/ReceptionPage.vue"),
            },
        ],
    },
    {
        path: "/admin",
        name: "Admin",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "user-management",
                name: "UserManagement",
                component: () => import("pages/admin/UserManagement.vue"),
            },
        ],
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue"),
    },
];

export default routes;
