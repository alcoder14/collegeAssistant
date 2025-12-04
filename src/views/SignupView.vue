<template>
  <main class="form-page">
    <SloganComponent />
    <section class="form-page-block block-2">
       <form @submit.prevent="handleSignup" class="form-container">
          <font-awesome-icon icon="fa fa-user-circle" class="user-circle" />
          <h1 class="form-title">Sign Up</h1>
          <input v-model="email" placeholder="Email" class="auth-input" />
          <input v-model="password" type="password" placeholder="Password" class="auth-input" style="margin-bottom: 1.5rem;" />
          <ErrorMessage :errorMsg="errorMsg" v-if="errorMsg" style="margin-bottom: 1rem;" />
          <div class="alt-action-container">
              <p class="text">Already a member? </p>
              <router-link to="/login"><button class="alt-action-btn">Log In</button></router-link>
          </div>

          <button v-if="!currently_authenticating" type="submit" class="confirm-btn light-btn">Confirm</button>

          <div v-else class="spinner-btn"><atom-spinner :animation-duration="1000" :size="30" color="#2C2C2C"/> <p>Authenticating...</p></div>

        </form>
    </section>

  </main>
  </template>
  
  <script setup>
import { ref } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase'; 
import { useRouter } from 'vue-router';
import ErrorMessage from '@/components/ErrorMessage.vue';
import SloganComponent from '@/components/Elements/SloganComponent.vue';
import { createSchedule } from '@/composables/scheduleQueries';
import { AtomSpinner } from 'epic-spinners';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const router = useRouter();

const currently_authenticating = ref(false)

const handleSignup = async () => {
  currently_authenticating.value = true
  errorMsg.value = '';
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    await createSchedule(user.uid)
    
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