<template>
    <div id="nav-wrap">
        <h1 class="logo">
            <img src="../../../assets/logo.png" alt />
        </h1>
        <el-menu
            default-active="1-4-1"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            background-color="transparent"
            text-color="#fff"
            active-text-color="#fff"
            :router="true"
        >
            <template v-for="(item,index) in routers">
                <!-- 一级菜单 -->
                <el-submenu v-if="!item.hidden" :key="item.id" :index="index+''">
                    <template slot="title">
                        <i :class="item.meta.icon"></i>
                        <span slot="title">{{item.meta.name}}</span>
                    </template>
                    <!-- 子级菜单 -->
                    <el-menu-item
                        v-for="subItem in item.children"
                        :key="subItem.id"
                        :index="subItem.path"
                    >{{subItem.meta.name}}</el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
        <!-- svg -->
        <!-- <svg-icon iconClass="console" className="console" /> -->
    </div>
</template>

<script>
import { reactive, ref, isRef, onMounted, computed } from "@vue/composition-api";
export default {
    name: 'navMenu',
    setup(props, { root }) {
        //data数据
        // const isCollapse = ref(false);
        const routers = reactive(root.$router.options.routes);
        /**
         * computer 监听
         */
        const isCollapse = computed(() => {
            return root.$store.state.app.isCollapse;
        });



        // console.log(root.$store.state.count)
        // console.log(root.$store.getters.count)
        // root.$store.commit('SET_COUNT', 100);
        return {
            isCollapse,
            routers
        }
    },
}
</script>

<style lang="scss" scopde>
@import "../../../styles/config.scss";
#nav-wrap {
    position: fixed;
    width: $navMenu;
    height: 100vh;
    top: 0;
    left: 0;
    background: #344a5f;
    @include webkit(transition, all 0.3s ease);
}
.el-menu {
    border-right: none;
}
.logo {
    text-align: center;
    img {
        margin: 28px auto;
        width: 92px;
        @include webkit(transition, all 0.3s ease);
    }
}
.open {
    #nav-wrap {
        width: $navMenu;
    }
}
.close {
    .el-submenu__title {
        span {
            display:none;
        }
    }
    #nav-wrap {
        width: $navMenuMin;
    }
    .logo img {
        width: 70%;
    }
}
</style>