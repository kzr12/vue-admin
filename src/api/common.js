import { GetCategory, GetCategoryAll } from "@/api/news";
import { reactive } from "@vue/composition-api";
export function common() {
    const category = reactive({
        item: []
    });
    //获取分类
    const getInfoCategory = (() => {
        GetCategory({}).then(res => {
            category.item = res.data.data.data
        }).catch(() => {

        })
    })

    /**
     * 获取全部分类
     */
    const getInfoCategoryAll = (() => {
        GetCategoryAll({}).then(res => {
            category.item = res.data.data
        }).catch(() => {

        })
    })

    return {
        getInfoCategory, category, getInfoCategoryAll
    }
}