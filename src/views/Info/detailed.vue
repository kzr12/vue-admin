<template>
    <el-form ref="form" :model="form" label-width="120px">
        <!-- 下拉框 -->
        <el-form-item label="信息分类：">
            <el-select v-model="form.categoryId">
                <el-option
                    v-for="item in data.category.item"
                    :key="item.id"
                    :value="item.id"
                    :label="item.category_name"
                ></el-option>
            </el-select>
        </el-form-item>
        <!-- 新闻标题 -->
        <el-form-item label="新闻标题：">
            <el-input v-model="form.title"></el-input>
        </el-form-item>
        <!-- 缩略图 -->
        <el-form-item label="缩略图：">
            <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
            >
                <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <!-- 发布日期 -->
        <el-form-item label="发布日期：">
            <el-date-picker v-model="form.createDate" type="date" placeholder="选择日期" disabled></el-date-picker>
        </el-form-item>
        <!-- 详情内容 -->
        <el-form-item label="详情内容：">
            <quillEditor v-model="form.content" ref="myQuillEditor" :options="data.editorOption"></quillEditor>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit" :loading="data.submitLoading">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { GetList, editInfo } from "@/api/news";
import { common } from "@/api/common";
import { timestampTOTime } from "@/utils/common";
import { ref, reactive, onMounted, onActivated } from "@vue/composition-api";
//富文本编辑器
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
    name: 'infoDetailed',
    components: { quillEditor },
    setup(props, { root }) {

        const { getInfoCategory, category: categoryInfo } = common();
        //data数据
        const data = reactive({
            category: categoryInfo,
            id: root.$route.query.id,
            editorOption: {},
            //按钮状态
            submitLoading: ref(false),
        })

        //form表单
        const form = reactive({
            categoryId: "",
            title: "",
            createDate: "",
            content: '',
            //上传图片的URL
            imageUrl: '',
        })



        /**
         * 方法
         */


        //获取信息列表
        const getList = (() => {
            let reqData = {
                pageNumber: 1,
                pageSize: 1,
                id: data.id
            };
            //接口
            GetList(reqData).then(res => {
                let data = res.data.data.data[0];
                form.categoryId = data.categoryId;
                form.title = data.title;
                form.createDate = timestampTOTime(data.createDate).substring(0, 9);
                form.content = data.content;
            }).catch(err => {

            })
        })

        //保存按钮
        const submit = (() => {
            //判断是否为空
            if (!form.categoryId || !form.title || !form.content) {
                root.$message.error('任何一项内容都不能为空!');
                return false
            }
            //按钮状态
            data.submitLoading = true;
            let reqData = {
                id: data.id,
                categoryId: form.categoryId,
                title: form.title,
                content: form.content,
                imgUrl: form.imageUrl
            }
            editInfo(reqData).then(res => {
                //添加成功弹窗
                root.$message.success(res.data.message);
                //按钮状态
                data.submitLoading = false;
            }).catch(err => {
                data.submitLoading = false;
            })
        })


        //上传图片方法
        const handleAvatarSuccess = (res, file) => {
            form.imageUrl = URL.createObjectURL(file.raw);
        };
        const beforeAvatarUpload = (file) => {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                root.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                root.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        };




        /**
        * 生命周期
        */
        onMounted(() => {
            getInfoCategory();
        })

        onActivated(() => {
            data.id = root.$route.query.id;
            getList();
        })

        return {
            data, form,
            // 方法
            submit, beforeAvatarUpload, handleAvatarSuccess
        }
    }
}
</script>

<style lang="scss" >
.el-form-item {
    margin: 20px 0;
}
.avatar-uploader {
    .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>