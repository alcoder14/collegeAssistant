<template>
    <main class="modal-container"  @click="closeModal($event)">
        <div class="modal-window" @submit.prevent="handleConfirm">
            <h2 class="modal-title">Delete Subject</h2>
            <p>Are you sure you want to delete subject?</p>
            <p>It will be deleted from the schedule. Your actions cannot be undone.</p>
            <div class="options">
                <button>Yes</button>
                <button>No</button>
            </div>
        </div>
    </main>
</template>

<script setup>
    import { defineEmits } from 'vue';

    const emit = defineEmits(['closed']);
    const closeModal = (event) => {
        if (event.target === event.currentTarget) {
            emit('closed');
        }
    }


    const handleConfirm = async () => {
        
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