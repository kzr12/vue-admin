import { requestUrl, loadTableData } from "@/api/requestUrl"

let tableLoadData = {
    data() {

    },
    created() {

    },
    mounted() {
        this.tableLoadData()
    },
    methods: {
        tableLoadData() {
            let reqJson = this.tableConfig.requestData;
            let reqData = {
                url: requestUrl[reqJson.url],
                method: reqJson.method,
                data: reqJson.data
            }
            loadTableData(reqData).then(res => {
                let resData = res.data.data;
                //赋值
                this.tableData = resData.data;
                //条数统计
                this.total = resData.total;
            }).catch(err => {

            })
        },
    },
}

export default tableLoadData;