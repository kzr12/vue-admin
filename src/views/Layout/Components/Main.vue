<template>
    <div id="main-wrap">
        <div class="main-container">
            <div class="content">
                <!-- 子路由显示区 -->
                <keep-alive>
                    <!-- 需要缓冲 -->
                    <router-view v-if="$route.meta.keepAlive" />
                </keep-alive>
                <!-- 不需要缓冲 -->
                <router-view v-if="!$route.meta.keepAlive" />
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scopde>
@import "../../../styles/config.scss";
#main-wrap {
    height: 100vh;
    // position: fixed;
    // left: $navMenu;
    // top: 75px;
    // bottom: 0px;
    // right: 0px;
    // border: solid 30px #f7f7f7;
    // background: #fff;
    // border-bottom: none;
    // -webkit-box-sizing: border;
}
.main-container {
    width: 100%;
    height: 100%;
    padding-top: $layoutHeader + 30;
    padding-left: $navMenu + 30;
    padding-right: 30px;
    @include webkit(box-sizing, border-box);
    @include webkit(transition, all 0.3s ease);
}
.content {
    width: 100%;
    height: auto;
    padding: 30px;
    @include webkit(box-sizing, border-box);
    background: #fff;
}
.open {
    .main-container {
        padding-left: $navMenu + 30;
    }
}
.close {
    .main-container {
        padding-left: $navMenuMin + 30;
    }
}
</style>