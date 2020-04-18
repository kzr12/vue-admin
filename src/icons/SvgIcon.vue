<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script>
import { reactive, ref, isRef, onMounted, computed } from "@vue/composition-api";
export default {
    name: 'svgIcon',
    // props: ['iconClass', 'className'],
    props: {
        iconClass: {
            type: String,//定义接受的类型
            default: ''
        },
        className: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        // console.log(props.iconClass)
        // console.log(props.className)
        const msg = ref('荣哥哥哥');

        //计算属性 得出最终结果 并返回
        const iconName = computed(() => `#icon-${props.iconClass}`);
        const svgClass = computed(() => {
            if ((props.className)) {
                return `svg-icon ${props.className}`;
            } else {
                return `svg-icon`;
            }
        })

        // const count = ref(1);
        /**
         * computed 监听属性变化，并计算属性
         */
        // const plusOne = computed(() => {
        //     return count.value + 1;
        // });

        return {
            msg,
            iconName,
            svgClass
        }
    },
}
</script>

<style lang="scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    fill:currentColor;
    color: #fff;
    font-size: 20px;
}
</style>