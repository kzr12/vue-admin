import service from "@/utils/request";

/**
 * 获取信息列表
 */
export function GetList(data) {
    return service.request({
        method: 'post',
        url: '/news/getList/',
        data: data
    })
}



/**
 * 新增信息
 */
export function AddInfo(data) {
    return service.request({
        method: 'post',
        url: '/news/add/',
        data: data
    })
}


/**
 * 编辑信息
 */
export function editInfo(data) {
    return service.request({
        method: 'post',
        url: '/news/editInfo/',
        data: data
    })
}


/**
 * 删除信息
 */
export function DeleteInfo(data) {
    return service.request({
        method: 'post',
        url: '/news/deleteInfo/',
        data: data
    })
}




/**
 * 一级分类添加
 */
export function AddFirstCategory(data) {
    return service.request({
        method: 'post',
        url: '/news/addFirstCategory/',
        data: data
    })
}

/**
 * 添加子级分类
 */
export function AddChildrenCategory(data) {
    return service.request({
        method: 'post',
        url: '/news/addChildrenCategory/',
        data: data
    })
}


/**
 * 获取分类
 */
export function GetCategory(data) {
    return service.request({
        method: 'post',
        url: '/news/getCategory/',
        data: data
    })
}

/**
 * 获取全部分类(包含子级)
 */
export function GetCategoryAll(data) {
    return service.request({
        method: 'post',
        url: '/news/getCategoryAll/',
        data: data
    })
}


/**
 * 删除分类
 */
export function DeleteCategory(data) {
    return service.request({
        method: 'post',
        url: '/news/deleteCategory/',
        data: data
    })
}


/**
 * 修改分类
 */
export function EditCategory(data) {
    return service.request({
        method: 'post',
        url: '/news/editCategory/',
        data: data
    })
}