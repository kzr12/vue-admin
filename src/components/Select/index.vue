<template>
    <el-select v-model="data.selectValue" @change="select">
        <el-option
            v-for="item in data.initOPtion"
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
    props: {
        config: {
            type: Object,
            default: () => { }
        },
        selectData: {
            type: Object,
            deafult: () => { }
        },
    },
    setup(props, { root, emit }) {
        const data = reactive({
            //下拉菜单数据
            selectValue: '',
            initOPtion: [],
            options: [
                { value: 'truename', label: '姓名' },
                { value: 'phone', label: '手机号' },
                { value: 'email', label: '邮箱' },
                { value: 'id', label: 'ID' },
                { value: 'title', label: '标题' },
            ]
        })


        /**
         * 初始化下拉选择
         */
        let initOption = () => {
            let initData = props.config.init;
            let optionArr = [];
            //数据效验
            if (initData.length > 0) {
                initData.forEach(item => {
                    let arr = data.options.filter(el => el.value == item)[0];
                    optionArr.push(arr);
                });
                //初始化赋值
                data.initOPtion = optionArr;
                //初始化搜索类型
                data.selectValue = optionArr[0].value;
            }
        }


        /**
         * 选择触发
         */
        const select = (val) => {
            let filterData = data.options.filter(item => item.value == val)[0];
            emit("update:selectData", filterData);
        }

        onMounted(() => {
            initOption()
        })

        return {
            // data
            data,
            //methods
            select,
        }
    },
}
</script>

<style>
</style>