<template>
    <div class="due-soon-task-container">
        <div class="modal-upper-row">
            <h1 class="title">Due Today</h1>
            <button class="close-btn" type="button" @click="emit('onclosenotification')">
                <font-awesome-icon icon="fa fa-times" />
            </button>
        </div>
        <div v-for="(task, index) in props.dueTodayTasks" :key="task.id" class="task-info" @click="redirectToProject(task.projectId)" :class="{'last-task-info': index === props.dueTodayTasks.length - 1}">
            <h1 class="task-title">{{ task.title }}</h1>
        </div>
    </div>
</template>
  
  <script setup>

  import { defineEmits, defineProps, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const emit = defineEmits(['onclosenotification'])
  const props = defineProps(['dueTodayTasks'])
  
  onMounted(() => {
    console.log(props.dueTodayTasks)
  })

  const router = useRouter()
  const redirectToProject = (projectID) =>{
    router.push("/projects/" + projectID)
  }

  
  </script>

<style lang="scss" scoped>
@import "@/assets/style.scss";  
  .due-soon-task-container{
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 200px;
    height: fit-content;
    z-index: 10;
    background-color: $dark;
    border-radius: 20px;
    color: $white;
    padding: 1rem;
    border: 2px solid $light;
    .title{
        font-size: 1.2rem;
    }
  }

  .task-info{
    background-color: $darkest;
    margin-bottom: 0.8rem;
    padding: 0.4rem;
    cursor: pointer;
    border-radius: 10px;
    .task-title{
        font-size: 1rem;
        font-weight: normal;
    }
  }
  .last-task-info{
    margin-bottom: 0;
  }

  @media(max-width: 625px){
    .due-soon-task-container{
      bottom: 1rem;
      right: 1rem;
    }
  }

</style>
  