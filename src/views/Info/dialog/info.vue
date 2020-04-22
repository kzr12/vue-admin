<template>
    <el-dialog
        title="新增"
        :visible.sync="data.dialog_info_flag"
        @close="close"
        width="580px"
        @open="openDialog"
    >
        <el-form :model="data.form" ref="addInfoForm">
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
import { AddInfo } from "@/api/news"
import { ref, reactive, watchEffect } from "@vue/composition-api"
export default {
    name: 'dialogInfo',
    props: {
        flag: {
            type: Boolean,
            default: false
        },
        category: {
            type: Array,
            default: () => []
        }
    },
    setup(props, { emit, root, refs }) {
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


        //watch
        watchEffect(() => {
            data.dialog_info_flag = props.flag;
        });

        // 关闭和取消方法
        const close = (() => {
            data.dialog_info_flag = false
            emit("update:flag", false)
            //重置表单
            resetForm();
        });

        // 吧分类赋予到
        const openDialog = (() => {
            data.categoryOption.item = props.category
        })

        //重置表单
        const resetForm = (() => {
            refs['addInfoForm'].resetFields();
        })

        //确定添加按钮
        const submit = (() => {

            //判断是否为空
            if (!data.form.category || !data.form.title || !data.form.content) {
                root.$message.error('任何一项内容都不能为空!');
                return false
            }


            data.submitLoading = true;
            let reqData = {
                category: data.form.category,
                title: data.form.title,
                content: data.form.content
            }
            AddInfo(reqData).then(res => {
                //添加成功弹窗
                root.$message.success(res.data.message);
                data.submitLoading = false;
                //重置表单
                resetForm();
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