import Vue from 'vue';
//自定义全局组件
import SvgIcon from './SvgIcon';
Vue.component('svg-icon', SvgIcon)


/**
 * require.context 读取指定目录的所有文件
 * 第一个：目录
 * 第二个：是否遍历子级目录
 * 第三个：定义遍历文件规则
 */
const req = require.context('./svg', false, /\.svg$/);//正则里面表示结尾，读取结尾为.svg 的文件
//es6
const requireAll = requireContext => {
    // console.log(requireContext.keys())
    return requireContext.keys().map(requireContext);
};

//es5
// const requireAll = function (requireContext) {
//     return requireContext.keys().map(requireContext);
// };

requireAll(req);