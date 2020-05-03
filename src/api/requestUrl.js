import service from "@/utils/request";

/**
 * 请求地址
 */
const requestUrl = {
    getUserList: '/user/getList/',
}



/**
 * 请求表格接口
 */
const loadTableData = (params) => {
    return service.request({
        method: params.method || 'post',
        url: params.url,
        data: params.data || {}
    })
}


/**
 * 获取省市区街关联
 */
const GetCityPicker = (data) => {
    return service.request({
        method: 'post',
        url: '/cityPicker/',
        data: data
    })
}


export { requestUrl, loadTableData, GetCityPicker }