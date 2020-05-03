<template>
    <el-select v-model="selectValue">
        <el-option
            v-for="item in initOPtionData"
            :key="item.id"
            :value="item.value"
            :label="item.label"
        ></el-option>
    </el-select>
</template>

<script>
import { reactive, watch, onMounted } from "@vue/composition-api";
export default {
    name: '',
    data() {
        return {
            //下拉菜单数据
            selectValue: '',
            initOPtionData: [],
            options: [
                { value: 'name', label: '姓名' },
                { value: 'phone', label: '手机号' },
                { value: 'email', label: '邮箱' },
                { value: 'id', label: 'ID' },
                { value: 'title', label: '标题' },
            ]
        }
    },
    methods: {
        /**
         * 初始化下拉选择
         */
        initOption() {
            let initData = this.config.init;
            let optionArr = [];
            //数据效验
            if (initData.length > 0) {
                initData.forEach(item => {
                    let arr = this.options.filter(el => el.value == item)[0];
                    optionArr.push(arr);
                });
                //初始化赋值
                this.initOPtionData = optionArr;
                //初始化搜索类型
                this.selectValue = optionArr[0].value;
            }
        }
    },
    props: {
        config: {
            type: Object,
            default: () => { }
        }
    },
    /**
     * 监听
     */
    watch: {
        config: {
            handler(newValue, oldValue) {
                this.initOption();
            },
            immediate: true,//组件初始化时 马上对config监听
        }
    },
}
</script>

<style>
</style>