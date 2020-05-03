let pagination = {
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            pageSizes: [10, 20, 30, 50],
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        handleSizeChange(val) {
            this.tableConfig.requestData.data.pageSize = val;
            this.tableLoadData();
        },
        handleCurrentChange(val) {
            this.tableConfig.requestData.data.pageNumber = val;
            this.tableLoadData();
        },
    },
}

export default pagination;