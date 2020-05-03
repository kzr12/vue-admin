<template>
    <div>
        <!-- 表格 -->
        <el-table border :data="tableData" style="width: 100%">
            <!-- 多选框 -->
            <el-table-column v-if="tableConfig.selection" type="selection" width="55"></el-table-column>

            <template v-for="item in tableConfig.tHead">
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
        <!-- 分页 -->
        <el-pagination
            v-if="tableConfig.pagiation"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
    </div>
</template>

<script>
import tableLoadData from "@/mixins/tableLoadData";
import pagination from "@/mixins/pagination";
export default {
    name: 'tableVue',
    mixins: [tableLoadData,pagination],
    data() {
        return {
            tableConfig: {
                selection: true,
                recordCheckbox: false,
                pagiation: true,
                requestData: {},
                tHead: []
            },
            //表格数据
            tableData: [],
        }
    },
    beforeMount() {
        this.initTableConfig();
    },
    methods: {
        initTableConfig() {
            let configData = this.config;
            for (let key in configData) {
                this.tableConfig[key] = configData[key];
            }
        }
    },
    props: {
        config: {
            type: Object,
            default: () => { }
        }
    },

}
</script>

<style>
</style>