import cookies from "cookie_js";


//获取token
export function getToken() {
    return cookies.get('admin_toKen');
}

//添加token
export function setToken(token) {
    return cookies.set('admin_toKen', token)
}

//移除token
export function removeToken() {
    return cookies.remove('admin_toKen');
}

//添加username
export function setUserName(value) {
    return cookies.set('username', value)
}

//获取username
export function getUserName() {
    return cookies.get('username')
}

//移除username
export function removeUserName() {
    return cookies.remove('username')
}