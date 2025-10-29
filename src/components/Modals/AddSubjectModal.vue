<template>
    <main class="modal-container"  @click="closeModal($event)">
        <form class="modal-window" @submit.prevent="handleConfirm">
            <h2 class="modal-title">New Subject</h2>
            <input type="text" placeholder="Subject name" v-model="subjectData.subjectName">
            <input type="text" placeholder="Subject abbreviation"  v-model="subjectData.subjectShortName">
            <input type="text" placeholder="Teacher"  v-model="subjectData.subjectTeacher">
            <div class="color-marker-container">
                 <label for="color">Color marker: </label>
                 <input type="color" id="color" style="margin-bottom: 0;" v-model="subjectData.color">
            </div>
            <button class="light-purple-btn" type="submit" style="margin-top: 1rem;">Confirm</button>
        </form>
    </main>
</template>

<script setup>
    import { ref, defineEmits } from 'vue';
    import { addSubject } from "@/composables/scheduleQueries.js";

    const emit = defineEmits(['closed', 'listUpdated']);
    const closeModal = (event) => {
        if (event.target === event.currentTarget) {
            emit('closed');
        }
    }

    const subjectData = ref({
        subjectName: "",
        subjectShortName: "",
        subjectTeacher: "",
        color: ""
    })

    const handleConfirm = async () => {
        try {
            await addSubject(subjectData.value);
            emit("closed");
            emit("listUpdated")
        } catch (error) {
            alert("Failed to add subject. Please try again.");
        }
    };


// STYLING, ERROR HANDLING
</script>

<style lang="scss" scoped>
      @import "@/assets/style.scss";
      .color-marker-container{
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        label{
            color: $white;
            margin-right: 1rem;
        }
      }
</style>