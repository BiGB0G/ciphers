<template lang="html">
    <header class="header">
        <el-menu
                :default-active="active"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
            <el-menu-item class="header__menu--item" index="1" @click="goTo('/')">Home</el-menu-item>
            <el-menu-item class="header__menu--item" index="2" @click="goTo('/cezar')">Cryptography</el-menu-item>
        </el-menu>
    </header>
</template>

<script>
    export default {
        name: "app-header",
        data() {
            return {
            }
        },
        mounted() {

        },
        props: {
            active: String
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            goTo: function (href) {
                this.$router.push(href);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
