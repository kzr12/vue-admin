import Vue from "vue";
import store from '../store/index.js';
//自定义指令
Vue.directive("btnPerm", {
    bind: function (el, bingind, vnode) {
        //操作DOM
        if (bingind.def.hasBtnPerm(bingind.value)) {
            el.className = el.className + ' show-Button'
        };
    },
    //操作父节点
    inserted: function () { },
    update: function () { },
    componentUpdated: function () { },
    unbind: function () { },
    hasBtnPerm: function (permission) {
        const button = store.getters["app/buttonPermission"];
        const roles = store.getters["app/roles"];//获取角色
        //如果是超级管理员
        if (roles.includes('admin')) {
            return true;
        }
        return button.indexOf(permission) != -1;
    }
})