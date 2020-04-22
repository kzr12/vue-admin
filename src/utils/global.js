import { MessageBox, Message } from 'element-ui';
export default {
    install(Vue, options) {
        Vue.prototype.confirm = function (data) {
            MessageBox.confirm(data.content, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: data.type || "warning",
                center: true
            }).then(() => {
                data.fu && data.fn(data.id);
                Message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                Message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
}