<template>
  <main class="form-page">

    <section class="form-page-block">
        <div class="slogan-container">
          <h1>COLLEGE <br> ASSISTANT</h1>
          <h3>All your subjects, schedules, and success in one place. </h3>
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
       <form @submit.prevent="handleSignup" class="form-container">
          <font-awesome-icon icon="fa fa-user-circle" class="user-circle" />
          <h1 class="form-title">Sign Up</h1>
          <input v-model="email" placeholder="Email" class="auth-input" />
          <input v-model="password" type="password" placeholder="Password" class="auth-input" style="margin-bottom: 1.5rem;" />

          <ErrorMessage :errorMsg="errorMsg" v-if="errorMsg" />
          <div class="alt-action-container">
              <p class="text">Already a member? </p>
              <router-link to="/login"><button class="alt-action-btn">Log In</button></router-link>
            </div>
          <button type="submit" class="confirm-btn light-btn">Confirm</button>
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

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const router = useRouter();

const handleSignup = async () => {
  errorMsg.value = '';
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    
    console.log(user)
    
    router.push('/schedule');
  } catch (err) {
    handleSignupError(err);
  }
};

const handleSignupError = (err) => {
  if (err.code === 'auth/email-already-in-use') {
    errorMsg.value = 'This email is already in use.';
  } else if (err.code === 'auth/invalid-email') {
    errorMsg.value = 'Invalid email address.';
  } else if (err.code === 'auth/weak-password') {
    errorMsg.value = 'Password should be at least 6 characters.';
  } else {
    errorMsg.value = 'Something went wrong. Please try again.';
    console.error('Signup error:', err);
  }
};
</script>

  
  <style lang="scss" scoped>
  @import "@/assets/style.scss";
</style>