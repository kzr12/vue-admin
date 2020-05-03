import router from "./index";
import { getToken, removeToken, removeUserName } from '@/utils/app';
import store from "../store/index"

const whiteRouter = ['/login'];//用indexOf方法判断

//路由守卫
router.beforeEach((to, from, next) => {
    //token存在的话
    if (getToken()) {
        if (to.path == '/login') {
            removeToken();
            removeUserName();
            store.commit("app/SET_TOKEN", '');
            store.commit("app/SET_USERNAME", '');
            next();
        } else {
            if (store.getters['app/roles'].length === 0) {
                store.dispatch('permission/getRoles').then(res1 => {
                    let roles = res1.role;
                    let button = res1.button;
                    let btnPerm = res1.btnPerm;
                    store.commit('app/SET_ROLES',roles);
                    store.commit('app/SET_BUTTON',btnPerm);
                    //存储角色
                    store.dispatch('permission/createRouter', roles).then(res2 => {
                        let addRouters = store.getters['permission/addRouters']
                        let allRouter = store.getters['permission/allRouter']
                        //路由更新
                        router.options.routes = allRouter;
                        //添加动态路由
                        router.addRoutes(addRouters)
                        next({ ...to, replace: true })//replace:true 不被历史记录
                    })
                });
            } else {
                next();
            }

        }
    } else {
        //token不存在
        if (whiteRouter.indexOf(to.path) !== -1) {
            next();
        } else {
            next('/login'); //路由指向
        }

    }

    // console.log(to)  //进入的页面 (下一个页面)
    // console.log(from) //离开之前的页面(即上一个)
    // console.log(next)
});