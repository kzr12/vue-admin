import { GetCityPicker } from "@/api/requestUrl";
import { reactive, toRefs } from '@vue/composition-api';
export function cityPicker() {
    const data = reactive({
        //省份数值
        provinceValue: '',
        //省份数据
        provinceData: [],
        //城市数值
        cityValue: '',
        //城市数据
        cityData: [],
        //区县数值
        areaValue: '',
        //区县数据
        areaData: [],
        //街道数值
        streetValue: '',
        //街道数据
        streetData: [],
    })

    //返回的数据
    const resData = reactive({
        provinceValue: '',
        cityValue: '',
        areaValue: '',
        streetValue: '',
    })



    
    //获取省份
    const getProvince = () => {
        GetCityPicker({ type: 'province' }).then(res => {
            data.provinceData = res.data.data.data
        })
    }
    //获取城市
    const handlerProvince = (val) => {
        resetValue('city');
        GetCityPicker({ type: 'city', province_code: val }).then(res => {
            data.cityData = res.data.data.data;
        })
    }
    //获取区县
    const handlerCity = (val) => {
        resetValue('area');
        GetCityPicker({ type: 'area', city_code: val }).then(res => {
            data.areaData = res.data.data.data;
        })
    }
    //获取街道
    const handlerStreet = (val) => {
        resetValue('street');
        GetCityPicker({ type: 'street', area_code: val }).then(res => {
            data.streetData = res.data.data.data;
        })
    }
    //选择街道时触发一个方法
    const streetFun = () => {
        //返回数据集合处理
        result();
    }


    /**
     * 重置选项
     */
    const resetValue = (params) => {
        const valueJson = {
            city: ['cityValue', 'cityData', 'areaValue', 'areaData', 'streetValue', 'streetData'],
            area: ['areaValue', 'areaData', 'streetValue', 'streetData'],
            street: ['streetValue', 'streetData'],
        }
        const arrObj = valueJson[params];
        arrObj.forEach(item => data[item] = '');
        //返回数据集合处理
        result();
    }


    /**
     * 返回数据集合
     */
    const result = () => {
        for (let key in resData) {
            resData[key] = data[key]
        }
    }


    return {
        data,resData,
        getProvince, handlerProvince, handlerCity, handlerStreet, streetFun,
    }
}