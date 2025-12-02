<template>
    <div class="inner-container">
      <nav>
        <router-link to="/dashboard" class="navbar-item" :class="{'item-selected': currentPage == '/dashboard'}" @click="paintButton('/dashboard')"><font-awesome-icon icon="fa fa-grip" class="navbar-icon"/>Dashboard </router-link>
          <router-link to="/schedule" class="navbar-item" :class="{'item-selected': currentPage == '/schedule'}" @click="paintButton('/schedule')"><font-awesome-icon icon="fa fa-table" class="navbar-icon"/>Schedule</router-link>
          <router-link to="/tests" class="navbar-item" :class="{'item-selected': currentPage == '/tests'}" @click="paintButton('/tests')"><font-awesome-icon icon="fa fa-clipboard-list" class="navbar-icon"/>Tests </router-link>
          <router-link to="/assignments" class="navbar-item" :class="{'item-selected': currentPage == '/assignments'}" @click="paintButton('/assignments')"><font-awesome-icon icon="fa fa-calendar-days" class="navbar-icon"/>Assignments</router-link>
        <router-link to="/notes" class="navbar-item" :class="{'item-selected': currentPage == '/notes'}" @click="paintButton('/notes')"> <font-awesome-icon icon="fa fa-note-sticky" class="navbar-icon"/>Notes</router-link>
      </nav>
      <div class="logout-container">
        <button class="logout-btn" @click="handleLogout"><font-awesome-icon icon="fa fa-right-from-bracket" /></button>
      </div>
    </div>
</template>

<script setup>
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const router = useRouter()

const currentPage = ref()
onMounted(() => {
  paintButton(route.path)
})

watch(
  () => route.path,
  (newPath) => {
    paintButton(newPath);
  }
);

const handleLogout = async () => {
    try {
        await signOut(auth);
        router.push('/login');
    } catch (error) {
        console.error('Logout error:', error.message);
    }
};

const paintButton = (button) => {
  currentPage.value = button
}
</script>

 <style lang="scss" scoped>
      @import "@/assets/style.scss";
      .nav-container{
        min-height: 90vh;
        background-color: $darkest;
        width: 15%;
        border-right: 2px solid #565656;
      }
      .inner-container{
        width: 15%;
        height: 90vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: fixed;
        bottom: 0;
        left: 0;
        border-right: 2px solid #565656;
        .logout-container{
          width: inherit;
          position: fixed;
          bottom: 0;
          left: 0;
          padding: 1rem;
          display: flex;
          justify-content: end;
        }
      }
      nav{
        display: flex;
        flex-direction: column;
        width: 100%;
        .navbar-item{
            width: 100%;
            color: $white;
            text-decoration: none;
            padding: 1rem;
            font-size: 1.5rem;
            .navbar-icon{
                margin-right: 1rem;
                color: $light;
            }
        }
      }
      .item-selected{
        background-color: $dark;
      }

      .logout-btn{
        background-color: transparent;
        color: $light;
        font-size: 2rem;
      }
      .logout-btn:hover{
        background-color: $dark;
      }
  </style>