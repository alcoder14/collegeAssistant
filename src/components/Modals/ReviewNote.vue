<template>
    <main class="modal-container"  @click="closeModal($event)">
        <form class="modal-window" style="width: 30%; border: 2px solid;" :style="{borderBottomColor: props.noteData.color}">
            <h2 class="modal-title" style="margin-bottom: 0.5rem;">{{ props.noteData.title }}</h2>
            <h4 class="modal-date">Created: {{ props.noteData.date }} at {{ props.noteData.time }}</h4>
            <div v-html="props.noteData.content" class="content"></div>
        </form>
    </main>
</template>

<script setup>
    import { defineEmits, defineProps } from 'vue';
    const props = defineProps(["noteData"])
    const emit = defineEmits(["closed"])

    const closeModal = (event) => {
        if (event.target === event.currentTarget) {
            emit('closed');
        }
    }

</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
    h2, h4, .content{
        color: $white;
    }
    h4{
        font-weight: lighter;
        margin-bottom: 2rem;
    }
</style>