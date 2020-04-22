import { MessageBox, Message } from 'element-ui';
import { ref } from "@vue/composition-api";
export function global() {
    const str = ref('');
    const confirm = ((data) => {
        MessageBox.confirm(data.content, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: data.type || "warning",
            center: true
        }).then(() => {
            // str.value = "删除删除删除";
            data.fn && data.fn(data.id || '')
            Message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {
            data.catchFn && data.catchFn(data.id || '')
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
    })
    return {
        str, confirm
    }
}