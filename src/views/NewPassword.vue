<template>
  <main class="form-page">
      <form @submit.prevent="handleSetNewPassword" class="form-container">
        <h1 class="form-title">Set New Password</h1>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="auth-input"
          style="margin-bottom: 1.5rem;"
          v-if="!password_reset_success"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          class="auth-input"
          style="margin-bottom: 1.5rem;"
          v-if="!password_reset_success"
        />
        <ErrorMessage :errorMsg="errorMsg" v-if="errorMsg" />
        <button type="submit" class="confirm-btn light-btn" v-if="password_reset_success">Confirm</button>

        <div class="password-reset-success">
            <font-awesome-icon icon="fa fa-check" class="check-password reset" />
            <p>Password has been reset succesfully</p>
            <router-link to="/login">Log In</router-link>
        </div>
      </form>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter, useRoute } from 'vue-router';
import ErrorMessage from '@/components/ErrorMessage.vue';

const password = ref('');
const confirmPassword = ref('');
const errorMsg = ref('');
const router = useRouter();
const route = useRoute();
const password_reset_success = ref(false)

let oobCode = ref('');

onMounted(() => {
  oobCode.value = route.query.oobCode;
});

const handleSetNewPassword = async () => {
  errorMsg.value = '';

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match';
    return;
  }

  if (!oobCode.value) {
    errorMsg.value = 'Invalid or missing password reset code.';
    return;
  }

  try {
    await verifyPasswordResetCode(auth, oobCode.value);
    await confirmPasswordReset(auth, oobCode.value, password.value);

    password_reset_success.value = true

    router.push('/login');
  } catch (err) {
    errorMsg.value = 'Failed to reset password.';
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style.scss";
</style>
