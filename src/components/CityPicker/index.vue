<template>
    <div class="overflow-h">
        <el-row :gutter="10">
            <!-- 省份 -->
            <el-col :span="6" v-if="init.province">
                <el-select v-model="data.provinceValue" @change="handlerProvince">
                    <el-option
                        v-for="item in data.provinceData"
                        :key="item.PROVINCE_CODE"
                        :value="item.PROVINCE_CODE"
                        :label="item.PROVINCE_NAME"
                    ></el-option>
                </el-select>
            </el-col>
            <!-- 城市 -->
            <el-col :span="6" v-if="init.city">
                <el-select v-model="data.cityValue" @change="handlerCity">
                    <el-option
                        v-for="item in data.cityData"
                        :key="item.CITY_CODE"
                        :value="item.CITY_CODE"
                        :label="item.CITY_NAME"
                    ></el-option>
                </el-select>
            </el-col>
            <!-- 区县 -->
            <el-col :span="6" v-if="init.area">
                <el-select v-model="data.areaValue" @change="handlerStreet">
                    <el-option
                        v-for="item in data.areaData"
                        :key="item.AREA_CODE"
                        :value="item.AREA_CODE"
                        :label="item.AREA_NAME"
                    ></el-option>
                </el-select>
            </el-col>
            <!-- 街道 -->
            <el-col :span="6" v-if="init.street">
                <el-select v-model="data.streetValue" @change="streetFun">
                    <el-option
                        v-for="item in data.streetData"
                        :key="item.STREET_CODE"
                        :value="item.STREET_CODE"
                        :label="item.STREET_NAME"
                    ></el-option>
                </el-select>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// import { GetCityPicker } from "@/api/requestUrl";
import { reactive, onMounted, watch } from '@vue/composition-api';
import { cityPicker } from "@/mixins/cityPicker"
export default {
    name: 'cityPicker',
    props: {
        cityPickerData: {
            type: Object,
            default: () => { },
        },
        cityPickerLevel: {
            type: Array,
            default: () => []
        }
    },
    setup(props, { root, emit }) {
        const { data, resData, getProvince, handlerProvince, handlerCity, handlerStreet, streetFun } = cityPicker();

        //初始化省市区联动
        const init = reactive({
            province: false,
            city: false,
            area: false,
            street: false,
        })

        /**
         * 初始化
         */
        const initCityPicker = () => {
            let initData = props.cityPickerLevel;
            if (initData.length == 0) {
                for (let key in init) {
                    init[key] = true;
                }
            } else {
                initData.forEach(item => {
                    init[item] = true;
                });
            }
        }


        watch([
            () => resData.provinceValue,
            () => resData.cityValue,
            () => resData.areaValue,
            () => resData.streetValue,
        ], ([provinceValue, cityValue, areaValue, streetValue]) => {
            emit("update:cityPickerData", resData)
        })


        onMounted(() => {
            //初始化获取省份
            getProvince();
            initCityPicker()
        })




        return {
            //数据
            data, init,
            // 方法
            handlerProvince, handlerCity, handlerStreet, streetFun
        }
    },
}
</script>

<style>
</style>