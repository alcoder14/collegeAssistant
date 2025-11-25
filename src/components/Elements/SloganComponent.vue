<template>
      <section class="form-page-block block-1">
          <div class="slogan-container">
            <div class="logo-container">
              <img src="@/assets/CollegeAssistantLogo.png">
              <h1>COLLEGE <br> ASSISTANT</h1>
            </div>
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
  </template>
  
  <script setup>

</script>

  
  <style lang="scss" scoped>
      @import "@/assets/style.scss";
      .logo-container{
        display: flex;
        flex-direction: row;
        img{
          height: 15vh;
          width: auto;
          margin-right: 2vh;
        }
      }
  </style>