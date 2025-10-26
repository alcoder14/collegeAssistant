<template>
    <main class="form-page">
      <SloganComponent />
      <section class="form-page-block block-2">
        <form @submit.prevent="handleLogin" class="form-container">
          <font-awesome-icon icon="fa fa-user-circle" class="user-circle" />
          <h1 class="form-title">Log In</h1>
          <input v-model="email" placeholder="Email" class="auth-input"/>
          <input v-model="password" type="password" placeholder="Password" class="auth-input" style="margin-bottom: 1.5rem;" />
          <ErrorMessage :errorMsg="errorMsg" v-if="errorMsg" />
          <div class="alt-action-container">
            <p class="text">Not a member? </p>
            <router-link to="/signup"><button class="alt-action-btn">Sign Up</button></router-link>
          </div>
          <button type="submit" class="confirm-btn light-btn" style="margin-bottom: 2rem;">Confirm</button>
          <div class="password-reset-container">
            <router-link to="/reset-password" class="reset-password-text">Forgot your password?</router-link>
          </div>
        </form>
      </section>

    </main>
  </template>
  
  <script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'vue-router';
import ErrorMessage from '@/components/ErrorMessage.vue';
import SloganComponent from '@/components/Elements/SloganComponent.vue';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const router = useRouter();

const handleLogin = async () => {
  errorMsg.value = ''; 
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/schedule');
  } catch (err) {
    console.log(err.code)
    errorMsg.value = 'Invalid Email or Password';
  }
};
</script>

  
  <style lang="scss" scoped>
      @import "@/assets/style.scss";
  </style>