<template>
    <main class="form-page">

      <section class="form-page-block">
          <div class="slogan-container">
            <h1>COLLEGE <br> ASSISTANT</h1>
            <h3> All your subjects, schedules, and success in one place. </h3>
            <div class="check-option">
              <font-awesome-icon icon="fa fa-check" class="check-light" />
              <p>Manage Schedules & Subjects</p>
            </div>
            <div class="check-option">
              <font-awesome-icon icon="fa fa-check" class="check-light" />
              <p>Create & Mark Notes</p>
            </div>
            <div class="check-option">
              <font-awesome-icon icon="fa fa-check" class="check-light" />
              <p>Keep Track of Assignments & Exams</p>
            </div>
            <div class="check-option">
              <font-awesome-icon icon="fa fa-check" class="check-light" />
              <p>Organize & Simplify Your Study Process</p>
            </div>
          </div>
       </section>

      <section class="form-page-block">
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
          <button type="submit" class="confirm-btn light-btn">Confirm</button>
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