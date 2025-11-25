<template>
    <main class="form-page">
      <SloganComponent />
      <section class="form-page-block block-2">
        <form @submit.prevent="handleLogin" class="form-container">
          <font-awesome-icon icon="fa fa-user-circle" class="user-circle" />
          <h1 class="form-title">Log In</h1>
          <input v-model="email" placeholder="Email" class="auth-input"/>
          <input v-model="password" type="password" placeholder="Password" class="auth-input" style="margin-bottom: 1rem;" />
          <ErrorMessage :errorMsg="errorMsg" v-if="errorMsg" style="margin-top: 0; margin-bottom: 1rem;" />
          <div class="alt-action-container">
            <p class="text">Not a member? </p>
            <router-link to="/signup"><button class="alt-action-btn">Sign Up</button></router-link>
          </div>

          <button v-if="!currently_authenticating" type="submit" class="confirm-btn light-btn" style="margin-bottom: 1rem;">Confirm</button>

          <div v-else class="spinner-btn" style="margin-bottom: 1rem;"><atom-spinner :animation-duration="1000" :size="30" color="#2C2C2C"/> <p>Authenticating...</p></div>

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
import { AtomSpinner } from 'epic-spinners';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const router = useRouter();


const currently_authenticating = ref(false)

const handleLogin = async () => {
  currently_authenticating.value = true
  errorMsg.value = ''; 
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    console.log(err.code)
    errorMsg.value = 'Invalid Email or Password';
  }
  currently_authenticating.value = false
};
</script>

  
  <style lang="scss" scoped>
      @import "@/assets/style.scss";
  </style>