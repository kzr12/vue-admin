<template>
    <el-dialog
        title="修改"
        :visible.sync="data.dialog_info_flag"
        @close="close"
        width="580px"
        @open="openDialog"
    >
        <el-form :model="data.form" ref="editFrom">
            <el-form-item label="类别" :label-width="data.formLabelWidth" prop="category">
                <el-select v-model="data.form.category" placeholder="请选择活动区域">
                    <el-option
                        v-for="item in data.categoryOption.item"
                        :key="item.id"
                        :label="item.category_name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="标题" :label-width="data.formLabelWidth" prop="title">
                <el-input v-model="data.form.title" placeholder="请输入标题"></el-input>
            </el-form-item>

            <el-form-item label="概括" :label-width="data.formLabelWidth" prop="content">
                <el-input type="textarea" v-model="data.form.content" placeholder="请输入内容"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="danger" @click="submit" :loading="data.submitLoading">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { GetList, editInfo } from "@/api/news"
import { ref, reactive, watchEffect } from "@vue/composition-api"
export default {
    name: 'dialogInfo',
    props: {
        flag: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: false
        },
        category: {
            type: Array,
            default: () => []
        }
    },
    setup(props, { emit, root, refs }) {
        //watch
        watchEffect(() => {
            data.dialog_info_flag = props.flag;
        });

        // 数据
        const data = reactive({
            dialog_info_flag: false,//弹窗标记
            formLabelWidth: '70px',
            form: {
                category: '',
                content: '',
                title: '',
            },
            categoryOption: {
                item: []
            },
            submitLoading: false,
        })


        // 关闭和取消方法
        const close = (() => {
            data.dialog_info_flag = false
            emit("update:flag", false)
            //重置表单
            resetForm();
        });

        // 打开时执行的方法
        const openDialog = (() => {
            data.categoryOption.item = props.category
            getInfo();
        })

        //获取当前编辑id的数据
        const getInfo = (() => {
            let reqData = {
                pageNumber: 1,
                pageSize: 1,
                id: props.id
            }

            //获取信息接口
            GetList(reqData).then(res => {
                let resData = res.data.data.data[0]
                //赋值给表单
                data.form = {
                    category: resData.categoryId,
                    content: resData.content,
                    title: resData.title
                }
            }).catch(err => {

            })
        })

        //重置表单
        const resetForm = (() => {
            refs['editFrom'].resetFields();
        })

        //确定按钮
        const submit = (() => {

            //判断是否为空
            if (!data.form.category || !data.form.title || !data.form.content) {
                root.$message.error('任何一项内容都不能为空!');
                return false
            }
            //按钮状态
            data.submitLoading = true;
            let reqData = {
                id: props.id,
                categoryId: data.form.category,
                title: data.form.title,
                content: data.form.content
            }
            editInfo(reqData).then(res => {
                //添加成功弹窗
                root.$message.success(res.data.message);
                //按钮状态
                data.submitLoading = false;
                //子组件用父组件方法
                emit("getListEmit");
            }).catch(err => {
                data.submitLoading = false;
            })
        })

        return {
            close, openDialog, submit, data
        }
    },

}
</script>

<style>
</style>