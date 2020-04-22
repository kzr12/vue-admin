<template>
    <div id="category">
        <el-button type="danger" @click="addFirst({type:'category_first_add'})">添加一级分类</el-button>
        <hr class="hr-xian" />
        <div>
            <el-row :gutter="30">
                <!-- 左边 -->
                <el-col :span="9">
                    <div class="category-wrap">
                        <div class="category" v-for="item in category.item" :key="item.id">
                            <!-- 一级分类 -->
                            <h4>
                                <i class="el-icon-circle-plus-outline"></i>
                                {{item.category_name}}
                                <div class="button-group pull-right">
                                    <!-- 编辑按钮 -->
                                    <el-button
                                        size="mini"
                                        type="danger"
                                        round
                                        @click="editCategory({data:item,type:'category_first_edit'})"
                                    >编辑</el-button>
                                    <!-- 添加子级 -->
                                    <el-button
                                        size="mini"
                                        type="success"
                                        round
                                        @click="handlerAddChildren(({data:item,type:'category_children_add'}))"
                                    >添加子级</el-button>
                                    <!-- 删除按钮 -->
                                    <el-button
                                        size="mini"
                                        round
                                        @click="deleteCategoryComfirm(item.id)"
                                    >删除</el-button>
                                </div>
                            </h4>
                            <!-- 子级分类 -->
                            <ul v-if="item.children">
                                <li v-for="childrenItem in item.children" :key="childrenItem.id">
                                    {{childrenItem.category_name}}
                                    <div class="button-group pull-right">
                                        <el-button
                                            size="mini"
                                            type="danger"
                                            round
                                            @click="childrenEdit({data:childrenItem,type:'category_children_edit'})"
                                        >编辑</el-button>
                                        <el-button
                                            size="mini"
                                            round
                                            @click="childrenDelete(childrenItem.id)"
                                        >删除</el-button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-col>
                <!-- 右边 -->
                <el-col :span="15">
                    <h4 class="menu-title">一级分类编辑</h4>
                    <el-form
                        label-width="142px"
                        :model="form"
                        style="width:410px;"
                        ref="categoryForm"
                    >
                        <el-form-item label="一级分类名称：" v-if="category_fist_input">
                            <el-input
                                v-model="form.categoryName"
                                :disabled="category_fist_disabled"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="二级分类名称：" v-if="category_children_input">
                            <el-input
                                v-model="form.secCategoryName"
                                :disabled="category_children_disabled"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="danger"
                                @click="submit"
                                :loading="submit_loading"
                                :disabled="submit_button_disabled"
                            >确定</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { global } from "@/utils/global_V3.0.js";
import { common } from "@/api/common";
import { AddFirstCategory, DeleteCategory, EditCategory, AddChildrenCategory } from "@/api/news";
import { ref, reactive, onMounted, watch } from "@vue/composition-api";
export default {
    name: 'infoCategory',
    setup(props, { root, refs }) {
        const { confirm } = global();
        const { getInfoCategory, category: InfoCategory, getInfoCategoryAll } = common();
        /**
         * data数据
         */
        //右边表单数据
        const form = reactive({
            categoryName: '',
            secCategoryName: ''
        })
        const category_fist_input = ref(true);
        const category_children_input = ref(true);
        const submit_loading = ref(false);
        const category_fist_disabled = ref(true);
        const category_children_disabled = ref(true);
        const submit_button_type = ref('');
        const submit_button_disabled = ref(true);
        const deleteId = ref('');

        //循环的一级分类和子分类数组
        const category = reactive({
            item: [],
            current: [],
        });



        /**
         * 功能方法
         */


        //一级分类编辑按钮
        const submit = (() => {
            if (submit_button_type.value == 'category_first_add') addFirstCategory();
            if (submit_button_type.value == 'category_first_edit' || submit_button_type.value == 'category_children_edit') editFirstCategory();
            if (submit_button_type.value == 'category_children_add') addChildrenCategory();
        })

        //一级分类添加方法
        const addFirstCategory = (() => {
            //判断是否为空
            if (!form.categoryName) {
                root.$message.error('分类名称不能为空!');
                return false;
            }
            //按钮加载状态
            submit_loading.value = true;
            AddFirstCategory({ categoryName: form.categoryName }).then(res => {
                if (res.data.resCode === 0) {
                    //成功弹窗提示
                    root.$message.success(res.data.message);
                    category.item.push(res.data.data);
                }
                submit_loading.value = false;
                form.categoryName = '';
                form.secCategoryName = '';
            }).catch(err => {
                submit_loading.value = false;
                form.categoryName = '';
                form.secCategoryName = '';
            })
        })


        // 添加一级分类按钮
        const addFirst = ((params) => {
            submit_button_type.value = params.type;
            category_fist_input.value = true;
            category_children_input.value = false;
            category_fist_disabled.value = false;
            submit_button_disabled.value = false;
        })


        //一级分类删除按钮
        const deleteCategoryComfirm = ((categoryId) => {
            deleteId.value = categoryId;
            confirm({
                content: '确认删除当前信息，确认后将无法恢复！！',
                fn: deleteCategory,
                catchFn: () => {
                    deleteId.value = '';
                }
            });
        })

        //删除方法
        const deleteCategory = (() => {
            DeleteCategory({ categoryId: deleteId.value }).then(res => {
                //更新列表
                getInfoCategoryAll();
            }).catch(err => { })
        })

        //添加子级按钮
        const handlerAddChildren = (params) => {
            //禁用一级输入框
            category_fist_disabled.value = true;
            //解除禁止子级输入框
            category_children_disabled.value = false;
            //显示按钮
            submit_button_disabled.value = false;
            //显示子级输入框
            category_children_input.value = true;
            //存储数据
            category.current = params.data;
            //显示一级分类名称
            form.categoryName = params.data.category_name;
            //更新确定按钮类型
            submit_button_type.value = params.type;
        }

        //添加子级方法接口
        const addChildrenCategory = () => {
            //判断是否为空
            if (!form.secCategoryName) {
                root.$message.error('子级分类不能为空!');
                return false;
            }
            let reqData = {
                parentId: category.current.id,
                categoryName: form.secCategoryName
            }
            AddChildrenCategory(reqData).then(res => {
                //成功弹窗
                root.$message.success('添加成功！');
                console.log(reqData)
                //添加成功后刷新数据
                getInfoCategoryAll();
                //清空子级输入框内容
                form.secCategoryName = '';
            }).catch(err => {

            })
        };


        //子级编辑按钮
        const childrenEdit = (params) => {
            //禁用一级输入框
            category_fist_disabled.value = true;
            //解除子级编辑框
            category_children_disabled.value = false;
            //显示按钮
            submit_button_disabled.value = false;
            //显示子级输入框
            category_children_input.value = true;
            //显示一级分类名称
            let firstData = category.item.filter(item => item.id == params.data.parent_id)[0];
            form.categoryName = firstData.category_name;
            //显示二级分类名称
            form.secCategoryName = params.data.category_name;
            //储存数据
            category.current = params.data;
            //更新确定按钮类型
            submit_button_type.value = params.type;
        }

        //子级删除按钮
        const childrenDelete = (categoryId) => {
            deleteId.value = categoryId;
            confirm({
                content: '确认删除当前信息，确认后将无法恢复！！',
                fn: deleteCategory,
                catchFn: () => {
                    deleteId.value = '';
                }
            });
        }


        //修改按钮方法
        const editCategory = ((params) => {
            submit_button_type.value = params.type;
            category_children_input.value = false;
            category_children_disabled.value = false;
            category_fist_disabled.value = false;
            submit_button_disabled.value = false;
            //一级名称输入还原类名
            form.categoryName = params.data.category_name;
            //存储当前的数据对象
            category.current = params.data;
        })


        //修改请求接口
        const editFirstCategory = (() => {
            //判断是否为空
            if (category.current.length == 0) {
                root.$message.error('未选择分类！！')
                return false;
            }
            // 判断是父级的编辑还是子级的编辑
            let from_categoryName = '';
            if (submit_button_type.value == 'category_first_edit') { from_categoryName = form.categoryName }
            if (submit_button_type.value == 'category_children_edit') { from_categoryName = form.secCategoryName }
            let data = {
                id: category.current.id,
                categoryName: from_categoryName
            }
            EditCategory(data).then(res => {
                //弹消息框
                root.$message.success(res.data.message);
                category.current.category_name = res.data.data.data.categoryName;
            }).catch(err => {

            })
        })

        /**
         * 生命周期
         */
        //页面dom元素完成渲染时执行
        onMounted(() => {
            getInfoCategoryAll();
        })

        /**
         * watch监听
         */
        watch(() => InfoCategory.item, value => {
            category.item = value
        })

        return {
            //reactive
            form, category,
            //ref
            category_fist_input, category_children_input, submit_loading, category_fist_disabled, category_children_disabled, submit_button_disabled,
            //方法
            submit, addFirst, deleteCategoryComfirm, editCategory, handlerAddChildren, childrenEdit, childrenDelete
        }
    },
}
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.category-wrap {
    div:first-child {
        &:before {
            top: 20px;
        }
    }
    div:last-child {
        &:before {
            bottom: 21px;
        }
    }
}
.menu-title {
    line-height: 44px;
    background: #f3f3f3;
    padding-left: 22px;
}
.category {
    position: relative;
    line-height: 44px;
    cursor: pointer;
    &:before {
        content: "";
        position: absolute;
        left: 22px;
        top: 0px;
        bottom: 0;
        width: 32px;
        border-left: 1px dotted #222;
    }
    h4 {
        padding-left: 40px;
        i {
            position: absolute;
            top: 1px;
            left: 15px;
            &::before {
                background: #fff;
            }
        }
    }
    li {
        position: relative;
        padding-left: 36px;
        margin-left: 24px;
        &:before {
            content: "";
            position: absolute;
            left: 0px;
            top: 22px;
            width: 32px;
            border-top: 1px dotted #222;
        }
    }
    li,
    h4 {
        &:hover {
            @include webkit(transition, all 0.5s ease);
            background: #f3f3f3;
            .button-group {
                display: block;
            }
        }
    }
}
.button-group {
    display: none;
    button {
        font-size: 12px;
    }
}
div.el-form-item {
    margin: 12px 0;
}
.hr-xian {
    width: calc(100% + 60px);
    margin: 30px 0px 30px -30px;
    border: none;
    border-bottom: 1px solid #d4d4d4;
}
</style>