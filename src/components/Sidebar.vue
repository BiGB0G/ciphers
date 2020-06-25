<template lang="html">
    <div class="sidebar">
        <el-menu
                class="el-menu-vertical-demo"
                :default-active="this.active"
                @open="handleOpen"
                @close="handleClose"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
            <el-menu-item class="sidebar__menu--item" index="1" @click="goTo('/cezar')">
                <i class="el-icon-grape"></i>
                <span>Cezar</span>
            </el-menu-item>
            <el-menu-item class="sidebar__menu--item" index="2" @click="goTo('/replacement')">
                <i class="el-icon-refresh"></i>
                <span>Replacement</span>
            </el-menu-item>
            <el-menu-item class="sidebar__menu--item" index="3" @click="goTo('/vigenere')">
                <i class="el-icon-bicycle"></i>
                <span>Vigenere</span>
            </el-menu-item>
            <el-menu-item class="sidebar__menu--item" index="4" @click="goTo('/affine')">
                <i class="el-icon-chicken"></i>
                <span>Affine</span>
            </el-menu-item>
            <el-menu-item class="sidebar__menu--item" index="4" @click="goTo('/other')">
                <i class="el-icon-menu"></i>
                <span>Other</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "sidebar",
        data() {
            return {

            }
        },
        props: {
            active: String
        },
        mounted() {
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            goTo: function (href) {
                let pathname = document.location.pathname;
                if(pathname[pathname.length - 1] === '/')
                    pathname = pathname.slice(0, pathname.length - 1);

                if(href !== pathname)
                    this.$router.push(href);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
