<template>
    <main class="modal-container"  @click="closeModal($event)">
        <form class="modal-window" @submit.prevent="handleConfirm" style="width: 40%">
            <h2 class="modal-title" v-if="props.noteData === null">New Note</h2>
            <h2 class="modal-title" v-else>Update Note</h2>

            <div class="input-fields" v-if="!loadingData">
                <div class="input-row">
                    <input placeholder="Title" type="text" class="text" v-model="noteData.title">
                    <DropdownComponent :selected-option="selectedSubject" :options="subjectOptions" style="margin-bottom: 1rem;" @onSelected="updateNoteSubjectID" />
                </div>
                <div style="margin-bottom: 1rem;">
                    <editor
                        id="uuid"
                        apiKey="y0mzuol04buvqvw5ccco93okfd24ddr4sxbaqitbmq2hidgt"
                        style="margin-bottom: 1rem;"
                        v-model="noteData.content"
                        :init="{
                            plugins: 'advlist anchor autolink charmap code fullscreen help  insertdatetime link lists preview searchreplace table visualblocks wordcount',
                            toolbar: 'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist',
                            height: 300,
                        }"
                    />
                </div>
            </div>

            <ErrorMessage v-if="errMessage !== ''" :error-msg="errMessage" style="margin-bottom: 1rem;" />

            <button class="light-purple-btn" type="submit" v-if="!loadingData && props.noteData === null">Add</button>

            <button class="light-purple-btn" type="submit" v-if="!loadingData && props.noteData !== null">Update</button>

            <div v-if="loadingData"> 
                Loading
            </div>
            
        </form>
    </main>
</template>

<script setup>
    import { defineEmits, ref, onMounted, defineProps } from 'vue';
    import DropdownComponent from '../Elements/DropdownComponent.vue';
    import ErrorMessage from '../ErrorMessage.vue';
    import { getUserSubjects } from '@/composables/scheduleQueries';
    import { addNote } from '@/composables/noteQueries';
    import { updateNote } from '@/composables/noteQueries';
    import Editor from '@tinymce/tinymce-vue'

    const props = defineProps(["noteData", "extractedSubject"])
    const emit = defineEmits(['closed', 'listUpdated']);

    const closeModal = (event) => {
        if (event.target === event.currentTarget) {
            emit('closed');
        }
    }

    const userSubjects = ref([])
    const subjectOptions = ref([])
    const noteData = ref({})

    const cardID = ref()
    const selectedSubject = ref(null)

    const loadingData = ref(true)

    onMounted( async () => {
        userSubjects.value = await getUserSubjects()
        userSubjects.value.forEach((subject) => {
            subjectOptions.value.push({
                value: subject.id,
                visibleValue: subject.subjectName
            })
        })
        console.log("here it be")
        console.log(subjectOptions.value)

        if(props.noteData === null){

            selectedSubject.value = subjectOptions.value[0].value

            noteData.value.title = ""
            noteData.value.content = ""
            noteData.value.subjectID = selectedSubject.value

        } else {

            selectedSubject.value = props.extractedSubject

            noteData.value.content = props.noteData.content
            noteData.value.title = props.noteData.title
            noteData.value.subjectID = props.noteData.subjectID
            
            cardID.value = props.noteData.id

        }


        loadingData.value = false
    })

    const updateNoteSubjectID = (value) => {
        selectedSubject.value = value
        noteData.value.subjectID = value
    }


    const handleConfirm = () => {
        if(props.noteData === null){
            handleInsert()
        } else {
            handleUpdate()
        }
    }

    noteData.value.date == null
    const errMessage = ref("")
    const handleInsert = async () => {
        errMessage.value = ""
        if(noteData.value.title.trim() == ""){
            errMessage.value = "Title Cannot Be Empty"
            return;
        }
    
        try {
            await addNote(noteData.value);
            emit("closed");
            emit("listUpdated")
        } catch (error) {
            alert("Failed. Please try again.");
        }
    
    };

    const handleUpdate = async () => {
        errMessage.value = ""
        if(noteData.value.title.trim() == ""){
            errMessage.value = "Title Cannot Be Empty"
            return;
        }
    
        try {
            console.log(noteData.value)
            await updateNote(cardID.value, noteData.value);
            emit("closed");
            emit("listUpdated")
        } catch (error) {
            alert("Failed. Please try again.");
        }
    }


// STYLING, ERROR HANDLING
</script>

<style lang="scss" scoped>
      @import "@/assets/style.scss";
      .input-fields{
        display: flex;
        flex-direction: column;
      }
      
      textarea, input{
        width: 100%;
        outline: 0;
        padding: 0.4rem 0.8rem;
        resize: vertical;
        font-size: 1rem;
      }
      .input-row{
        display: grid;
        grid-template-columns: 49% 49%;
        justify-content: space-between;
      }
      .date{
        font-size: 1rem;
        padding: 6px 10px;
        background-color: $dark;
        color: $white;
        border: solid 2px $darkest;
      }
</style>