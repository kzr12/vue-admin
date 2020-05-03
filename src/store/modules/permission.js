import { getUserRole } from "@/api/login"
import { defaultRouterMap, asnycRouterMap } from "@/router"


function hasPremission(roles, router) {
    if (router.meta && router.meta.role) {
        return roles.some(item => router.meta.role.indexOf(item) >= 0)
    }
}

const state = {
    allRouter: defaultRouterMap,
    addRouters: [],
};

const getters = {//computed
    allRouter: state => state.allRouter,//所有的路由
    addRouters: state => state.addRouters,//匹配的路由
};

const mutations = {//方法  同步  没有回调处理事件
    SET_ROUTER(state, router) {
        state.addRouters = router;
        state.allRouter = defaultRouterMap.concat(router)
    }
};


const actions = {//可以回调处理事件
    /**
     * 获取用户角色
     */
    getRoles({ commit }, reqData) {
        return new Promise((reslove, inject) => {
            getUserRole().then(res => {
                let role = res.data.data;
                reslove(role)
            })
        })
    },
    /**
     * 创建动态路由
     */
    createRouter({ commit }, reqData) {
        return new Promise((reslove, inject) => {
            let role = reqData;
            let addRouters = [];
            //超管状态
            if (role.includes('admin')) {
                addRouters = asnycRouterMap
            } else {//普通管理
                addRouters = asnycRouterMap.filter(item => {
                    if (hasPremission(role, item)) {
                        //优先判断
                        if (item.children && item.children.length > 0) {
                            item.children.filter(child => {
                                if (hasPremission(role, child)) {
                                    return child;
                                }
                            })
                        }
                        return item;
                    }
                    return item;
                })
                addRouters.push(asnycRouterMap[asnycRouterMap.length - 1]);
            }
            //更新路由
            commit('SET_ROUTER', addRouters)
            reslove();
        })
    }
};


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};