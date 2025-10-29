<template>
    <HeaderDesktop />
    <DesktopNavbar :selected="'NotesView'" />
    <main class="view-blank">
        <div class="view-container">

        </div>
    </main>
</template>

<script setup>
    import HeaderDesktop from '@/components/Elements/HeaderDesktop.vue';
    import DesktopNavbar from '@/components/Elements/DesktopNavbar.vue';
</script>

<style lang="scss" scoped>
      @import "@/assets/style.scss";
</style>