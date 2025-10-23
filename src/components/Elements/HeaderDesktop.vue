<template>
    <header>
        <h1>COLLEGE ASSISTANT</h1>
        <button class="logout-btn" @click="handleLogout"><font-awesome-icon icon="fa fa-right-from-bracket" /></button>
    </header>
</template>

<script setup>
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'vue-router';

const router = useRouter()

const handleLogout = async () => {
    try {
        await signOut(auth);
        router.push('/login');
    } catch (error) {
        console.error('Logout error:', error.message);
    }
};

</script>

  <style lang="scss" scoped>
      @import "@/assets/style.scss";
      header{
        width: 100%;
        height: 10vh;
        padding: 2vh;
        background-color: $darkest;
        display: flex;
        justify-content: space-between;
      }
      h1{
        color: $white;
        font-weight: bold;
        font-size: 2rem;
      }
      .logout-btn{
        background-color: $dark;
        color: $light;
        font-size: 1.5rem;
      }
  </style>