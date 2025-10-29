<template>
  <div class="nav-container">
    <nav>
        <router-link to="/dashboard" class="navbar-item" :class="{'item-selected': props.selected === 'DashboardView'}"><font-awesome-icon icon="fa fa-grip" class="navbar-icon"/>Dashboard </router-link>
        <router-link to="/schedule" class="navbar-item" :class="{'item-selected': props.selected === 'ScheduleView'}"><font-awesome-icon icon="fa fa-table" class="navbar-icon"/>Schedule</router-link>
        <router-link to="/exams" class="navbar-item" :class="{'item-selected': props.selected === 'ExamsView'}"><font-awesome-icon icon="fa fa-clipboard-list" class="navbar-icon"/>Exams </router-link>
        <router-link to="/assignments" class="navbar-item" :class="{'item-selected': props.selected === 'AssignmentsView'}"><font-awesome-icon icon="fa fa-calendar-days" class="navbar-icon"/>Assignments</router-link>
        <router-link to="/notes" class="navbar-item" :class="{'item-selected': props.selected === 'NotesView'}"> <font-awesome-icon icon="fa fa-note-sticky" class="navbar-icon"/>Notes</router-link>
    </nav>
  </div>
</template>

<script setup>
     import { defineProps } from 'vue';
     const props = defineProps(['selected'])
</script>

  <style lang="scss" scoped>
      @import "@/assets/style.scss";
      .nav-container{
        min-height: 90vh;
        background-color: $darkest;
        width: 15%;
        border-right: 2px solid #565656;
      }
      nav{
        width: 100%;
        height: 90vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
  </style>