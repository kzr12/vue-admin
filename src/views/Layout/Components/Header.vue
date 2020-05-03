<template>
    <div id="header-wrap">
        <div class="pull-left header-icon">
            <i class="el-icon-menu" @click="navMenuState"></i>
        </div>
        <div class="pull-right">
            <div class="imgbox pull-left"><img src="../../../assets/head.jpg" alt=""></div>
            <div class="user-info pull-left">{{username}}</div>
            <div class="pull-left header-icon">
                <i class="el-icon-s-tools" @click="logout"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from '@vue/composition-api';
export default {
    name: 'layoutHeader',
    setup(props, { root }) {
        const username = computed(() => {
            return root.$store.state.app.username
        });
        const navMenuState = () => {
            return root.$store.commit('app/SET_COLLAPSE');
        }
        //退出的方法
        const logout = (() => {
            return root.$confirm('你确认要退出吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                root.$store.dispatch("app/logout").then((res) => {
                    //清除所有后成功则跳转
                    root.$router.push({
                        name: 'login'
                    })
                })
            }).catch(() => {
                root.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        });
        return {
            navMenuState,
            username,
            logout
        };
    },
}
</script>

<style lang="scss" scopde>
@import "../../../styles/config.scss";
#header-wrap {
    position: fixed;
    left: $navMenu;
    top: 0px;
    right: 0;
    height: 75px;
    background: #fff;
    z-index: 10;
    @include webkit(box-shadow, 0 3px 16px 0px rgba(0, 0, 0, 0.1));
    line-height: 75px;
    @include webkit(transition, all 0.3s ease);
}
.header-icon {
    padding: 0 32px;
    i {
        font-size: 25px;
        cursor: pointer;
        color: #535353;
    }
}
.user-info {
    padding: 0 25px;
    height: 100%;
    border-right: 1px solid #ededed;
    + .header-icon {
        padding: 0 28px;
    }
}
.open {
    #header-wrap {
        left: $navMenu;
    }
}
.close {
    #header-wrap {
        left: $navMenuMin;
    }
}
.imgbox {
    margin: 10px 0px;
    width: 50px;
    height: 50px;
    overflow: hidden;
    border-radius: 50%;
    img{
        width: 100%;
        height: 100%;
    }
}
</style>