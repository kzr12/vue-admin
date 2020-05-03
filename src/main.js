import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//路由守卫
import "./router/premit";
//自定义全局方法
// import global from "@/utils/global.js";
// Vue.use(global);
//自定义全局组件
import "./icons/index";
//全局方法引入按钮权限
import { buttonPermission } from "./utils/buttonPermission"
//自定义按钮权限
import "./utils/buttonPerm";
Vue.prototype.btnPerm = buttonPermission;
Vue.use(ElementUI);
Vue.use(VueCompositionApi);
Vue.config.productionTip = false;





new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
