<template>

    <HeaderDesktop v-if="showNavbarAndHeader" /> 
    <div class="container" v-if="showNavbarAndHeader">
      <DesktopNavbar selected="Dashboard" v-if="visibleNavbar === 'desktop'" />
      <main class="content">
          <router-view />
      </main>
    </div>

    <router-view v-else/>
</template>

<script setup>
  import HeaderDesktop from './components/Elements/HeaderDesktop.vue';
  import DesktopNavbar from './components/Elements/DesktopNavbar.vue';
  import { computed, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute()
  const pagesWithoutNavbar = ['/login', '/signup', '/reset-password'];

  const showNavbarAndHeader = computed(()=>{
    if(pagesWithoutNavbar.includes(route.path)){
      return false
    } else {
      return true
    }
  })

  let visibleNavbar = ref(null)

  const checkWidth = () => {
    if(window.innerWidth > 1650){
      visibleNavbar.value = "desktop"
    } else {
      visibleNavbar.value = "mobile"
    }
  }

  onMounted(() => {
    checkWidth()
    window.addEventListener("resize", checkWidth)
  })

</script>

<style lang="scss">
    @import "@/assets/style.scss";
  .container{
      display: flex;
      flex-direction: row;
  }
  .content{
      background-color: $dark;
      width: 85%;
      min-height: 90vh;
      padding: 2rem;
  }

  @media(max-width: 1651px){
    .content{
        width: 100%;
    }
  }
  @media(max-width: 1000px){
    .content{
      padding: 1rem;
      min-height: 93vh;
  }
}
</style>
