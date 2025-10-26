<template>
    <main class="form-page">
      <SloganComponent />
      <section class="form-page-block block-2">
        <form @submit.prevent="handleResetPassword" class="form-container">
          <h1 class="form-title" v-if="!email_sent_success">Reset Password</h1>
          <h1 class="form-title" v-if="email_sent_success">Email Sent</h1>
          <input v-model="email" placeholder="Email" class="auth-input" v-if="!email_sent_success"/>
          <ErrorMessage :errorMsg="errorMsg" v-if="errorMsg" />
          <button type="submit" class="confirm-btn light-btn" v-if="!email_sent_success">Confirm</button>

          <div v-if="email_sent_success" class="email-success-container">
            <font-awesome-icon icon="fa fa-check" class="check-email-sent" />
            <p>Follow instructions provided in the email sent to {{ email }}</p>
          </div>

        </form>
      </section>
    </main>
</template>
  
<script setup>
import SloganComponent from '@/components/Elements/SloganComponent.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ref } from 'vue';

const auth = getAuth();
const email = ref('')
const errorMsg = ref('')
const email_sent_success = ref(false)

const actionCodeSettings = {
  url: 'http://localhost:8080/login', 
  handleCodeInApp: true, 
};

const handleResetPassword = async () => {
    errorMsg.value = '';
    try{
        console.log(email.value)
        await sendPasswordResetEmail(auth, email.value, actionCodeSettings)
        email_sent_success.value = true
    } catch(err) {
        console.log(err)
        errorMsg.value = 'Please re-enter your email address.'
    }
}
</script>

  
  <style lang="scss" scoped>
      @import "@/assets/style.scss";
      .email-success-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        .check-email-sent{
            color: $light;
            margin-bottom: 1rem;
            font-size: 4rem;
        }
        p{
            color: $white;
            font-size: 1rem;

        }
      }
  </style>