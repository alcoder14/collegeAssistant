<template>
    <div class="notes-interface interface">
        <div class="management-row">
            <div class="left-side">
                <h2 class="interface-title">Notes</h2>
                <font-awesome-icon icon="fa fa-plus" @click="toggleNoteModal" class="interface-add-btn" />
            </div>
            <div class="right-side">
                <DropdownComponent :options="subjectOptions" :selected-option="selectedSubject" @closed="toggleNoteModal" @onSelected="setNewSelected"/>
            </div>
        </div>

        <div class="notes-container" v-if="notesData.length > 0">
            <div class="note-card" v-for="(item, i) in filteredNotesData" :key="item.id" :style="{borderBottomColor: item.color}">
                <div class="left-side">
                    <h3 :style="{color: item.color}" style="text-transform: capitalize;">{{ item.title }}</h3>
                    <h4 :style="{color: item.color}"> {{ transformDate(item.date) }} at {{ item.time }}</h4>
                    <h4 style="margin-bottom: 0;">{{ item.subjectName }}</h4>
                </div>
                <div class="right-side">
                    <button class="management-btn"><font-awesome-icon icon="fa fa-pen" @click="extractCardData(i, item.subjectID)" /></button>
                    <button class="management-btn"><font-awesome-icon icon="fa fa-trash" @click="removeNote(item.id)" /></button>
                </div>
            </div>
        </div>

        <div class="placeholder" v-if="filteredNotesData.length === 0 && !loadingData">
            No Notes To Show
        </div>

        <div class="loader" v-if="loadingData">
            <atom-spinner :animation-duration="1000" :size="100" color="#55DFD4"/>
            <p style="margin-top: 1rem">Loading</p>
        </div>

    </div>
        

    <!-- Add Mode -->
    <NoteModal @closed="toggleNoteModal" @listUpdated="prepareData" v-if="noteModalVisible" :noteData="null"/>

    <!-- Update Mode -->
    <NoteModal @closed="toggleUpdateNoteModal" @listUpdated="prepareData" v-if="updateNoteModalVisible" :noteData="notes[cardNumber]" :extractedSubject="cardSubject" />

</template>

<script setup>
    import DropdownComponent from '@/components/Elements/DropdownComponent.vue';
    import { ref, onMounted } from "vue"
    import { transformDate } from '@/composables/general';
    import { getUserNotes, deleteNote } from '@/composables/noteQueries';
    import { getUserSubjects } from '@/composables/scheduleQueries';
    import NoteModal from '@/components/Modals/NoteModal.vue';
    import { AtomSpinner } from 'epic-spinners';

    const noteModalVisible = ref(false)
    const toggleNoteModal = () =>{
        noteModalVisible.value = !noteModalVisible.value
    }

    const cardSubject = ref(null)
    let cardNumber;

    const extractCardData = (card, subject) => {
        cardNumber = card
        cardSubject.value = subject
        toggleUpdateNoteModal()
    }


    const updateNoteModalVisible = ref(false)
    const toggleUpdateNoteModal = () =>{
        updateNoteModalVisible.value = !updateNoteModalVisible.value
    }

    onMounted( () => {
        prepareData()
    })

    const prepareData = async () => {
        await Promise.all([loadNotes(), loadSubjects()])
        compileNoteData()
    }

    const notes = ref()
    const loadNotes = async () => {
        notes.value = await getUserNotes()
    }

    const subjectOptions = ref([{
        value: "all",
        visibleValue: "All"
    }])
    const subjects = ref()
    const loadSubjects = async () => {
        subjects.value = await getUserSubjects()

        subjectOptions.value = [{
            value: "all",
            visibleValue: "All"
        }]

        subjects.value.forEach((subject) => {
            subjectOptions.value.push({
                value: subject.id,
                visibleValue: subject.subjectName
            })
        })
    }

    const notesData = ref([])
    const compileNoteData = () => {
        notesData.value = []
        notes.value.forEach((note) => {
            subjects.value.forEach((subject) => {
                if(note.subjectID === subject.id){
                    notesData.value.push({
                        ...note,
                        subjectName: subject.subjectName,
                        subjectID: subject.id,
                        color: subject.color
                    })
                }
            })
        })
        filterByType()
    }

    const removeNote = async (id) => {
        notesData.value = notesData.value.filter((note) => note.id !== id)
        filteredNotesData.value = filteredNotesData.value.filter((note) => note.id !== id)
        await deleteNote(id)
    }

    const selectedSubject = ref("all")
    const setNewSelected = (value) => {
        selectedSubject.value = value
        filterByType()
    }

    const loadingData = ref(true)

    const filteredNotesData = ref([])
    const filterByType = () => {
        if (selectedSubject.value === "all") {
            filteredNotesData.value = notesData.value
        } else {
            filteredNotesData.value = notesData.value.filter(note => note.subjectID === selectedSubject.value)
        }
        loadingData.value = false
    }

</script>

<style lang="scss" scoped>
      @import "@/assets/style.scss";

      .note-card{
        padding: 1rem;
        background-color: $dark;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 2px solid;
        margin-bottom: 1rem;
        color: $white;
        h4{
            margin-bottom: 0.5rem;
            font-weight: lighter;
        }
      }

</style>