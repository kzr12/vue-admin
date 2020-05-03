import service from "@/utils/request";


/**
 * 获取角色
 */
export function GetRole(data = {}) {
    return service.request({
        method: 'post',
        url: '/role/',
        data: data
    })
}

/**
 * 按钮权限
 */
export function GetPermButton(data = {}) {
    return service.request({
        method: 'post',
        url: '/permButton/',
        data: data
    })
}

/**
 * 获取系统列表
 */
export function GetSystem(data = {}) {
    return service.request({
        method: 'post',
        url: '/system/',
        data: data
    })
}

/**
 * 用户添加
 */

export function UserAdd(data = {}) {
    return service.request({
        method: 'post',
        url: '/user/add/',
        data: data
    })
}

/**
 * 用户编辑
 */

export function UserEdit(data = {}) {
    return service.request({
        method: 'post',
        url: '/user/edit/',
        data: data
    })
}

/**
 * 用户删除
 */

export function UserDel(data = {}) {
    return service.request({
        method: 'post',
        url: '/user/delete/',
        data: data
    })
}

/**
 * 用户禁启用状态
 */

export function UserActives(data) {
    return service.request({
        method: 'post',
        url: '/user/actives/',
        data: data
    })
}