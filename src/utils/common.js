//时间戳转为正常日期
export function timestampTOTime(timestamp) {
    var date = new Date(timestamp * 1000 + 43200000);
    var Y = date.getFullYear() + '-';
    var M = date.getMonth() + 1 + '-';
    var D = date.getDate() + '　';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
}