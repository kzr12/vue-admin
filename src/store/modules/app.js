import { setToken, setUserName, getUserName, removeToken, removeUserName } from "@/utils/app"

const state = {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    to_Ken: '',
    username: getUserName() || '',
};

const getters = {//computed
    isCollapse: state => state.isCollapse
};

const mutations = {//方法  同步  没有回调处理事件
    SET_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse;
        //HTML5的本地存储
        window.sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
    },
    SET_TOKEN(state, value) {
        state.to_Ken = value;
    },
    SET_USERNAME(state, value) {
        state.username = value;
    },
};


const actions = {//可以回调处理事件
    //保存登录的token到cookies里面
    save_Info(content, resData) {
        let data = resData.data;
        content.commit('SET_TOKEN', data.token)
        content.commit('SET_USERNAME', data.username)
        setToken(data.token)
        setUserName(data.username)
    },
    //退出的方法
    exit({ commit }) {
        return new Promise((resolve, reject) => {
            removeToken();
            removeUserName();
            commit('SET_TOKEN', '');
            commit('SET_USERNAME', '');
            resolve();
        })
    },
};


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};