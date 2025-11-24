<template>
    <HeaderDesktop />
    <div class="flex-container">
        <DesktopNavbar :selected="'NotesView'" />

        <main class="view-blank">
            <div class="view-container">

                <div class="notes-interface interface">
                    <div class="management-row">
                        <div class="left-side">
                            <h2 class="interface-title">Notes</h2>
                            <button @click="toggleNoteModal"><font-awesome-icon icon="fa fa-plus" /> New</button>
                        </div>
                        <div class="right-side">
                            <DropdownComponent :options="subjectOptions" :selected-option="selectedSubject" @closed="toggleNoteModal" @onSelected="setNewSelected"/>
                        </div>
                    </div>

                    <div class="notes-container" v-if="notesData.length > 0">
                        <div class="note-card" v-for="(item, i) in filteredNotesData" :key="item.id" :style="{borderBottomColor: item.color}">
                            <div class="left-side">
                                <h3 :style="{color: item.color}" style="text-transform: capitalize;">{{ item.title }}</h3>
                                <h4 :style="{color: item.color}">{{ item.date }} at {{ item.time }}</h4>
                                <h4 style="margin-bottom: 0;">{{ item.subjectName }}</h4>
                            </div>
                            <div class="right-side">
                                <button @click="setReviewNoteData(item)"><font-awesome-icon icon="fa fa-eye"/></button>
                                <button><font-awesome-icon icon="fa fa-pen" @click="extractCardData(i, item.subjectID)" /></button>
                                <button><font-awesome-icon icon="fa fa-trash" @click="removeNote(item.id)" /></button>
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
        
            </div>
        </main>

    </div>

    <!-- Add Mode -->
    <NoteModal @closed="toggleNoteModal" @listUpdated="prepareData" v-if="noteModalVisible" :noteData="null"/>

    <!-- Update Mode -->
    <NoteModal @closed="toggleUpdateNoteModal" @listUpdated="prepareData" v-if="updateNoteModalVisible" :noteData="notes[cardNumber]" :extractedSubject="cardSubject" />

    <!-- Review Mode -->
    <ReviewNote @closed="toggleReviewNote" v-if="reviewNoteModalVisible" :noteData="reviewNoteData" />
</template>

<script setup>
    import HeaderDesktop from '@/components/Elements/HeaderDesktop.vue';
    import DesktopNavbar from '@/components/Elements/DesktopNavbar.vue';
    import DropdownComponent from '@/components/Elements/DropdownComponent.vue';
    import { ref, onMounted } from "vue"

    import { getUserNotes, deleteNote } from '@/composables/noteQueries';
    import { getUserSubjects } from '@/composables/scheduleQueries';
    import NoteModal from '@/components/Modals/NoteModal.vue';
    import ReviewNote from '@/components/Modals/ReviewNote.vue';
    import { AtomSpinner } from 'epic-spinners';

    const reviewNoteData = ref(null)
    const setReviewNoteData = (item) => {
        reviewNoteData.value = item
        toggleReviewNote()
    }

    const reviewNoteModalVisible = ref(false)
    const toggleReviewNote = () => {
        reviewNoteModalVisible.value = !reviewNoteModalVisible.value
    }

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
        console.log("here the notes be:")
        console.log(notes.value)
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

        console.log("BELOW:")
        console.log(notesData.value)
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