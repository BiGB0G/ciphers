<template lang="html">
    <div>
        <app-header active="2"></app-header>
        <div class="content-wrapper">
            <div class="sidebar-wrap">
                <Sidebar active="4"></Sidebar>
            </div>
            <main style="padding: 20px">
                Soon...
            </main>
        </div>
    </div>
</template>

<script>
    import AppHeader from "@/components/AppHeader";
    import Sidebar from "@/components/Sidebar";

    export default {
        name: "cezar",
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

</style>