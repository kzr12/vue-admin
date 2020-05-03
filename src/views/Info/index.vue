<template>
    <div>
        <!-- 第一行的组件     -->
        <el-row :gutter="20">
            <el-col :span="4">
                <!-- 类型选择 -->
                <div class="label-warp category">
                    <label for>分类：</label>
                    <div class="warp-content">
                        <el-select v-model="category_value" placeholder="请选择" style="width:100%;">
                            <el-option
                                v-for="item in options.category"
                                :key="item.id"
                                :label="item.category_name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
            </el-col>
            <el-col :span="10">
                <!-- 时间选择器 -->
                <div class="label-warp date">
                    <label for>日期：&nbsp;&nbsp;</label>
                    <div class="warp-content">
                        <el-date-picker
                            v-model="date_value"
                            type="daterange"
                            align="right"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            style="width:100%;"
                        ></el-date-picker>
                    </div>
                </div>
            </el-col>
            <el-col :span="4">
                <!-- 关键字搜索 -->
                <div class="label-warp key-work">
                    <label for>关键字：&nbsp;&nbsp;</label>
                    <div class="warp-content">
                        <SelectVue :config="data.configOption" />
                    </div>
                </div>
            </el-col>
            <el-col :span="4">
                <el-input v-model="search_keyWork" placeholder="请输入内容" style="width:100%;"></el-input>
            </el-col>
            <!-- 按钮 -->
            <el-col :span="2">
                <el-button type="danger" style="height:40px;" @click="search">搜索</el-button>
            </el-col>
        </el-row>
        <!-- table组件 -->
        <el-table
            :data="table_data.item"
            border
            style="width: 100%;margin:36px 0;"
            v-loading="loadingData"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="标题" width="360"></el-table-column>
            <el-table-column prop="categoryId" label="类型" width="130" :formatter="toCategory"></el-table-column>
            <el-table-column prop="createDate" label="日期" width="200" :formatter="toDate"></el-table-column>
            <el-table-column prop="user" label="管理员" width="115"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        @click="editInfo(scope.row.id)"
                        v-btnPerm="'info:edit'"
                        class="hiden-Button"
                    >编辑</el-button>
                    <el-button
                        size="mini"
                        type="success"
                        @click="detailed(scope.row)"
                        v-btnPerm="'info:detailed'"
                        class="hiden-Button"
                    >编辑详情</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="deleteItem(scope.row.id)"
                        v-btnPerm="'info:del'"
                        class="hiden-Button"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 底部分页 -->
        <el-row>
            <el-col :span="8">
                <el-button
                    size="medium"
                    icon="el-icon-edit"
                    type="success"
                    @click="dialog_info=true"
                    v-btnPerm="'info:add'"
                >添加</el-button>
                <el-button size="medium" @click="deleteAll">批量删除</el-button>
            </el-col>
            <el-col :span="16">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 50, 100]"
                    background
                    layout="total, sizes,prev, pager, next,jumper"
                    :total="total"
                    class="pull-right"
                ></el-pagination>
            </el-col>
        </el-row>
        <!-- 新增弹窗 -->
        <DialogInfo :flag.sync="dialog_info" :category="options.category" @loadData="getList" />
        <!-- 编辑弹窗 -->
        <DialogInfoEdit
            :flag.sync="dialog_info_edit"
            :id="exitInfoId"
            :category="options.category"
            @getListEmit="getList"
        />
    </div>
</template>

<script>
import { GetCategory, GetList, DeleteInfo } from "@/api/news";
import DialogInfo from "./dialog/info";
import DialogInfoEdit from "./dialog/edit";
import { global } from "../../utils/global_V3.0";
import { common } from "@/api/common";
import { timestampTOTime } from "@/utils/common";
import { reactive, ref, watchEffect, onMounted, watch, onBeforeMount } from '@vue/composition-api'
import SelectVue from "@c/Select"
export default {
    name: 'infoIndex',
    components: { DialogInfo, DialogInfoEdit, SelectVue },//引入子组件
    setup(props, { root }) {
        //把global方法 赋给 confirm
        const { str, confirm } = global();
        const { getInfoCategory, category } = common();

        /**
         * data数据
         */
        const data = reactive({
            //下拉菜单数据
            configOption: {
                init: ["id", "title"],
            }
        })
        const category_value = ref('');
        const date_value = ref('');
        const search_key = ref('id');
        const search_keyWork = ref('');
        //信息总条数
        const total = ref(0);
        //页码
        const page = reactive({
            pageNumber: 1,
            pageSize: 10,
        })
        //loading
        const loadingData = ref(false);
        // 添加信息弹窗标记
        const dialog_info = ref(false);
        const dialog_info_edit = ref(false);
        //要删除的信息数据
        const deleteInfoId = ref('');
        //要编辑的id
        const exitInfoId = ref('');
        //数据分类
        const options = reactive({
            category: []
        });

        /**
         * 搜索关键字
         */
        const tasearch_options = reactive([
            {
                value: 'id',
                label: "ID"
            },
            {
                value: 'title',
                label: '标题'
            },
        ])
        /**
         * 表格数据
         *  */
        const table_data = reactive({
            item: []
        });

        /**
         * 功能方法
         */

        //分页
        const handleSizeChange = ((val) => {
            page.pageSize = val;
            getList();
        });
        const handleCurrentChange = ((val) => {
            page.pageNumber = val;
            getList();
        })

        //时间戳转普通时间
        const toDate = ((row, column, cellValue, index) => {
            return timestampTOTime(row.createDate)
        })

        //table类型转为正常文字显示
        const toCategory = ((row, column, cellValue, index) => {
            let categoryId = row.categoryId;
            let categoryData = options.category.filter(item => item.id == categoryId)[0];
            if (!categoryData) { return false };
            return categoryData.category_name;
        })

        //table删除弹窗方法
        const deleteItem = ((data) => {
            deleteInfoId.value = [data];
            confirm({
                content: '确认删除当前信息，确认后将无法恢复！！',
                fn: confirmDelete,
                id: '22222'
            });
        })

        //批量删除弹窗方法
        const deleteAll = (() => {
            if (deleteInfoId.value.length == 0) {
                root.$message.error('你还未选择要删除的数据!');
                return false;
            }
            confirm({
                content: "确认删除选择的数据，确认后将无法恢复！！",
                type: 'error',
                fn: confirmDelete,
                id: '11111'
            });
        })

        //信息删除方法
        const confirmDelete = (() => {
            DeleteInfo({ id: deleteInfoId.value }).then(res => {
                deleteInfoId.value = '';
                getList();
            }).catch(err => {

            })
        })

        //table最前面的多选时触发的方法
        const handleSelectionChange = ((val) => {
            let id = val.map(item => item.id);
            deleteInfoId.value = id;
        })

        //编辑按钮
        const editInfo = ((id) => {
            exitInfoId.value = id;
            dialog_info_edit.value = true;
        })

        //编辑详情按钮
        const detailed = (data) => {
            //路由跳转
            root.$router.push({
                name: "InfoDetailed",
                query: {
                    id: data.id
                }
            })
        }

        //搜索按钮
        const search = (() => {
            getList();
        })

        //数据处理
        const formatData = (() => {
            let requesData = {
                pageNumber: page.pageNumber,
                pageSize: page.pageSize,
            };
            //分类id
            if (category_value.value) requesData.categoryId = category_value.value;
            //日期
            if (date_value.value.length > 0) {
                requesData.startTiem = date_value.value[0];
                requesData.endTime = date_value.value[1];
            }
            //关键字
            if (search_keyWork.value) requesData[search_key.value] = search_keyWork.value;
            return requesData;
        })

        //获取信息列表table
        const getList = (() => {
            //加载状态
            loadingData.value = true;
            //单独处理数据
            let requesData = formatData();
            //接口
            GetList(requesData).then(res => {
                //更新table数据
                table_data.item = res.data.data.data;
                //页码统计数量
                total.value = res.data.data.total;
                //loading隐藏
                loadingData.value = false;
            }).catch(err => {
                //loading隐藏
                loadingData.value = false;
            })
        })


        /**
         * 生命周期
         */
        onBeforeMount(() => {
            getInfoCategory();
            getList();
        })

        /**
         * 监听
         */
        watch(() => category.item, (value) => {
            options.category = value;
        })



        return {
            //ref
            category_value, date_value, search_key, search_keyWork, dialog_info, total, loadingData, dialog_info_edit, exitInfoId, data,
            //reactive
            options, tasearch_options, table_data,
            //methods
            handleSizeChange, handleCurrentChange, deleteItem, deleteAll, toDate, toCategory, handleSelectionChange, search, editInfo, getList, detailed
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-warp {
    &.category {
        @include labelDom(left, 60, 40);
    }
    &.date {
        @include labelDom(right, 93, 40);
    }
    &.key-work {
        @include labelDom(right, 100, 40);
    }
}
button[type="button"] {
    margin: 0 5px;
}
</style>

<style>
button.hiden-Button {
    display: none;
}
button.show-Button {
    display: inline-block;
}
</style>