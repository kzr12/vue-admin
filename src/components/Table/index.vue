<template>
    <div>
        <!-- 表格 -->
        <el-table
            border
            :data="data.tableData"
            @selection-change="thatSelectCheckBox"
            style="width: 100%"
        >
            <!-- 多选框 -->
            <el-table-column v-if="data.tableConfig.selection" type="selection" width="55"></el-table-column>

            <template v-for="item in data.tableConfig.tHead">
                <!-- v-slot -->
                <el-table-column
                    :key="item.field"
                    :prop="item.field"
                    :label="item.label"
                    :width="item.width"
                    v-if="item.columnType==='slot'"
                >
                    <template slot-scope="scope">
                        <slot :name="item.slotName" :data="scope.row"></slot>
                    </template>
                </el-table-column>
                <!-- 文本数据渲染 -->
                <el-table-column
                    :key="item.field"
                    :prop="item.field"
                    :label="item.label"
                    :width="item.width"
                    v-else
                ></el-table-column>
            </template>
        </el-table>
        <!-- 底部 -->
        <div class="table-footer">
            <el-row>
                <el-col :span="4">
                    <slot name="tableFotterLeft"></slot>
                </el-col>
                <el-col :span="20">
                    <!-- 分页 -->
                    <el-pagination
                        class="pull-right"
                        v-if="data.tableConfig.pagiation"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageData.currentPage"
                        :page-sizes="pageData.pageSizes"
                        :page-size="pageData.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageData.total"
                    ></el-pagination>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { reactive, ref, onMounted, onBeforeMount, watch } from "@vue/composition-api"
import { LoadData } from "./tableLoadData.js"
import { paginationHook } from './paginationHook';
export default {
    name: 'tableVue',
    props: {
        config: {
            type: Object,
            default: () => { }
        },
        tableRow: {
            type: Object,
            default: () => { }
        },
    },
    setup(props, { root, emit }) {
        //加载数据
        const { tableData: TableData, tableLoadData } = LoadData();
        //页码
        const { pageData, handleSizeChange, handleCurrentChange, totalCount } = paginationHook();
        const data = reactive({
            tableConfig: {
                selection: true,
                recordCheckbox: false,
                pagiation: true,
                requestData: {},
                tHead: []
            },
            //表格数据
            tableData: [],
        })

        /**
         * 监听
         */
        //数据监听
        watch([
            () => TableData.item,
            () => TableData.total,
        ], ([TableData, total]) => {
            data.tableData = TableData;
            totalCount(total)
        })
        //页码监听
        watch([
            () => pageData.currentPage,
            () => pageData.pageSize,
        ], ([currentPage, pageSize]) => {
            let reqData = data.tableConfig.requestData;
            if (reqData.data) {
                reqData.data.pageNumber = currentPage
                reqData.data.pageSize = pageSize
                tableLoadData(data.tableConfig.requestData);
            }
        })

        /**
         * 方法
         */


        //初始化table配置项
        const initTableConfig = () => {
            let configData = props.config;
            for (let key in configData) {
                data.tableConfig[key] = configData[key];
            }
        }

        /**
         * 勾选checkbox时触发
         */
        const thatSelectCheckBox = (val) => {
            let rowData = {
                idItem: val.map(item => item.id),
            }
            emit("update:tableRow", rowData)
        }

        /**
         * table刷新数据
         */
        const refreshData = () => {
            tableLoadData(data.tableConfig.requestData);
        }

        /**
         * 带参数的刷新数据
         */
        const paramsLoadData = (params) => {
            let reqData = Object.assign({}, params, {
                pageNumber: 1,
                pageSize: 10,
            })
            data.tableConfig.requestData.data = reqData;
            tableLoadData(data.tableConfig.requestData);
        }


        /**
         * DOM元素挂载前
         */
        onBeforeMount(() => {
            initTableConfig();
            tableLoadData(data.tableConfig.requestData);
        })



        return {
            //数据
            data, pageData,
            //方法
            handleSizeChange, handleCurrentChange, thatSelectCheckBox, refreshData, paramsLoadData
        }
    }
}
</script>

<style lang="scss" scoped>
.el-table {
    margin-top: 15px;
}
.table-footer {
    margin-top: 15px;
}
</style>