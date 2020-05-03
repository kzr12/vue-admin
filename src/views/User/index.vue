<template>
    <div>
        <!-- 第一行 -->
        <el-row :gutter="16">
            <!-- 第一行左边 -->
            <el-col :span="20">
                <div class="label-warp">
                    <label for>关键字：</label>
                    <div class="warp-content">
                        <el-row :gutter="16">
                            <!-- 下拉框 -->
                            <el-col :span="3">
                                <SelectVue
                                    :config="data.configOption"
                                    :selectData.sync="data.selectData"
                                />
                            </el-col>
                            <!-- 输入框 -->
                            <el-col :span="8">
                                <el-input v-model="data.key_word" placeholder="请输入搜索的关键字"></el-input>
                            </el-col>
                            <!-- 按钮 -->
                            <el-col :span="12">
                                <el-button type="danger" @click="search">搜索</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-col>
            <!-- 第一行右边 -->
            <el-col :span="4">
                <el-button type="danger" class="pull-right" @click="handlerAdd">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 表格组件 -->
        <TableVue ref="userTable" :config="data.configTable" :tableRow.sync="data.tableRow">
            <!-- 插槽 -->
            <template v-slot:status="slotData">
                <el-switch
                    @change="handlerSwitch(slotData.data)"
                    v-model="slotData.data.status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="2"
                    inactive-value="1"
                ></el-switch>
            </template>
            <template v-slot:operation="slotData">
                <el-button size="mini" type="success" @click="handlerExit(slotData.data)">编辑</el-button>
                <el-button size="mini" type="danger" @click="operation(slotData.data)">删除</el-button>
            </template>
            <template v-slot:tableFotterLeft>
                <el-button size="mini" type="danger" @click="handlerBatchDel">批量删除</el-button>
            </template>
            <!-- ↑↑↑↑↑↑↑↑插槽 -->
        </TableVue>
        <!-- 添加用户弹窗 -->
        <DialogAdd
            :flag.sync="data.dialog_add"
            :editData="data.editData"
            @refreshTableData="refreshData"
        />
    </div>
</template>

<script>
import { global } from "@/utils/global_V3.0.js";
import { reactive } from '@vue/composition-api'
import { UserDel, UserActives } from "@/api/user"
import SelectVue from "@c/Select";
import TableVue from "@c/Table";
import DialogAdd from "./dialog/add";
export default {
    name: 'userIndex',
    components: { SelectVue, TableVue, DialogAdd },
    setup(props, { root, refs }) {
        const { confirm } = global();
        const data = reactive({
            //添加用户弹窗
            dialog_add: false,
            //下拉菜单数据
            configOption: {
                init: ["truename", "phone", "email"],
            },
            //下拉菜单数组
            selectData: { value: 'truename', label: '姓名' },
            //搜索关键字
            key_word: '',
            //禁启用阻止状态
            updateUserStatusFlag: false,
            //编辑数据
            editData: {},
            //table选择的数据
            tableRow: {},
            //表格配置数据
            configTable: {
                //请求接口
                requestData: {
                    url: 'getUserList',
                    method: 'post',
                    data: {
                        pageNumber: 1,
                        pageSize: 10,
                    },
                },
                //多选框
                selection: true,
                //翻页记录checkbox
                recordCheckbox: false,
                //是否显示页码
                pagiation: true,
                //表头
                tHead: [
                    {
                        label: "邮箱/用户名",
                        field: "username",
                        width: 200,
                    },
                    {
                        label: "真实姓名",
                        field: "truename",
                        width: 126,
                    },
                    {
                        label: "手机号",
                        field: "phone",
                    },
                    {
                        label: "地区",
                        field: "region",
                    },
                    {
                        label: "角色",
                        field: "role",
                    },
                    {
                        label: "禁启用状态",
                        field: "status",
                        columnType: 'slot',
                        slotName: 'status',
                    },
                    {
                        label: "操作",
                        field: "",
                        columnType: 'slot',
                        slotName: 'operation',
                        width: 200,
                    },
                ],
            },
        })


        /**
         * 方法
         */

        //搜索按钮
        const search = () => {
            let reqData = {
                [data.selectData.value]: data.key_word
            }
            refs.userTable.paramsLoadData(reqData);
        }



        // 单点删除按钮
        const operation = (params) => {
            data.tableRow.idItem = [params.id]
            confirm({
                content: '确认删除当前信息，确认后将无法恢复！！',
                fn: userDelete,
            });
        }
        //批量删除按钮
        const handlerBatchDel = () => {
            let userId = data.tableRow.idItem;
            if (!userId || userId.length == 0) {
                root.$message.error('请勾选需要删除的用户！');
                return false;
            }

            confirm({
                content: '确认删除当前信息，确认后将无法恢复！！',
                fn: userDelete,
            });
        }
        //添加用户
        const handlerAdd = () => {
            data.dialog_add = true
            //子组件赋值
            data.editData = Object.assign({});
        }
        //编辑按钮
        const handlerExit = (params) => {
            data.dialog_add = true;
            //子组件赋值
            data.editData = Object.assign({}, params);
        }
        //删除用户方法
        const userDelete = () => {
            UserDel({ id: data.tableRow.idItem }).then(res => {
                refreshData();
            })
        }

        //禁启用方法
        const handlerSwitch = (params) => {
            if (data.updateUserStatusFlag) { return false };
            data.updateUserStatusFlag = true;
            let reqData = {
                id: params.id,
                status: params.status,
            }
            UserActives(reqData).then(res => {
                root.$message.success(res.data.message);
                data.updateUserStatusFlag = !data.updateUserStatusFlag;
            }).catch(err => {
                data.updateUserStatusFlag = !data.updateUserStatusFlag;
            })
        }



        /**
         * 刷新table数据
         */
        const refreshData = () => {
            refs.userTable.refreshData();
        }

        return {
            // data
            data,
            //methods
            operation, handlerBatchDel, refreshData, handlerSwitch, handlerExit, handlerAdd, search,
        }
    },
}
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-warp {
    @include labelDom(left, 60, 40);
}
</style>