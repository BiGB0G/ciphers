import Vue from 'vue';
import VueRouter from 'vue-router';
import Cezar from "@/views/Cezar";
import Home from "@/views/Home";
import Other from "@/views/Other";
import CezarDecode from "@/views/CezarDecode";
import SRC from "@/views/SRC";
import Vigenere from "@/views/Vigenere";
import Affine from "@/views/Affine";
import Permutation from "@/views/Permutation";
import Affine2 from "@/views/Affine2";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/cezar',
            name: 'cezar',
            component: Cezar
        },
        {
            path: '/cezar/decode',
            name: 'cezar-decode',
            component: CezarDecode
        },
        {
            path: '/other',
            name: 'other',
            component: Other
        },
        {
            path: '/replacement',
            name: 'replacement',
            component: SRC
        },
        {
            path: '/vigenere',
            name: 'vigenere',
            component: Vigenere
        },
        {
            path: '/affine',
            name: 'affine',
            component: Affine
        },
        {
            path: '/permutation',
            name: 'permutation',
            component: Permutation
        },
        {
            path: '/affine2',
            name: 'affine2',
            component: Affine2
        },
    ]
});

export default router;

/*router.beforeEach((to, from, next) => {
    next();
/!*    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.state.user.loggedIn) {
            next({
                path: '/spa/login',
                query: {redirect: to.fullPath}
            });
        } else {
            // next();
            if (store.state.user.isAdmin) {
                if (localStorage.getItem('isAdmin')) {
                    next();
                }
                else {
                    next({
                        path: '/spa/login',
                        query: {redirect: to.fullPath}
                    });
                }
            } else {
                next();
            }
        }
    } else {
        next();
    }*!/
});*/
