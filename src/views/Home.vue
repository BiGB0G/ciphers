<template lang="html">
    <div>
        <app-header active="1"></app-header>
        <div class="content-wrapper">
            <div class="sidebar-wrap">
                <Sidebar active="0"></Sidebar>
            </div>
            <main>
                <div class="home-wrapper">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col">
                                <div class="home-wrapper">
                                    <h1>Home page</h1>
                                    <div class="home-content">
                                        <div>Training project for the course cryptography.</div>
                                        <div>The project is based on <a href="https://vuejs.org/" target="_blank">Vue.js</a> technology using the <a
                                                href="https://element.eleme.io/" target="_blank">el-elements</a> component library.
                                            <a href="https://getbootstrap.com/" target="_blank">Bootstrap</a> was also used.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
    import AppHeader from "@/components/AppHeader";
    import Sidebar from "@/components/Sidebar";

    export default {
        name: "home",
        components: {
            AppHeader,
            Sidebar
        },
        data() {
            return {

            }
        },
        mounted() {

        },
        methods: {

        }
    }
</script>

<style scoped lang="scss">
    .home-wrapper{
        padding: 10px;
    }
    h1{
        text-align: center;
    }
</style>