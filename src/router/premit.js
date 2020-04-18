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
            next();
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