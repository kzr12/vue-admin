<template>
    <div id="main-wrap">
        <div class="main-container">
            <div class="content">
                <router-view />
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
    height: 100%;
    padding-top: 30px;
    padding-left: 30px;
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