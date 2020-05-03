import { reactive } from "@vue/composition-api"


export function paginationHook() {
    //分页数据
    const pageData = reactive({
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 20, 30, 50],
    })

    //统计数据条数
    const totalCount = (val) => {
        pageData.total = val;
    }

    //每页的显示数量
    const handleSizeChange = (val) => {
        pageData.pageSize = val;
    }

    //显示第几页
    const handleCurrentChange = (val) => {
        pageData.currentPage = val;
    }



    return {
        pageData, handleSizeChange, handleCurrentChange, totalCount
    }
}