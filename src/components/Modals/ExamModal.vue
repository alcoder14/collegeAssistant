<template>
    <main class="modal-container"  @click="closeModal($event)">
        <form class="modal-window" @submit.prevent="handleConfirm">
            <h2 class="modal-title">New Exam</h2>

            <div class="input-fields">
                <div class="input-column">
                    <input type="date" class="date">
                    <DropdownComponent :selected-option="selectedType" :options="typeOptions" />
                </div>
                <textarea placeholder="Description (optional)"></textarea>
            </div>

            <button class="light-purple-btn" type="submit" style="margin-top: 1rem;">Confirm</button>
        </form>
    </main>
</template>

<script setup>
    import { defineEmits, ref } from 'vue';
    import DropdownComponent from '../Elements/DropdownComponent.vue';

    const typeOptions = ref([
        {
            value: "colloquium",
            visibleValue: "Colloquium"
        }, 
        {
            value: "exam",
            visibleValue: "Exam"
        }
    ])

    const selectedType = ref("exam")

    const emit = defineEmits(['closed', 'listUpdated']);
    const closeModal = (event) => {
        if (event.target === event.currentTarget) {
            emit('closed');
        }
    }


    /*
    const handleConfirm = async () => {
        try {
            await addSubject(subjectData.value);
            emit("closed");
            emit("listUpdated")
        } catch (error) {
            alert("Failed to add subject. Please try again.");
        }
    };
    */


// STYLING, ERROR HANDLING
</script>

<style lang="scss" scoped>
      @import "@/assets/style.scss";
      .input-fields{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .input-column, textarea{
        width: 48%;
      }
      .input-column{
        display: flex;
        flex-direction: column;
      }
      
      textarea{
        outline: 0;
        padding: 0.4rem 0.8rem;
      }
      .date{
        font-size: 1rem;
        padding: 6px 10px;
        background-color: $dark;
        color: $white;
        border: solid 2px $darkest;
      }
</style>