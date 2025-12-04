<template>
    <main class="modal-container"  @click="closeModal($event)">
        <form class="modal-window" @submit.prevent="handleConfirm">
            <h2 class="modal-title" v-if="props.assignmentData === null">New Assignment</h2>
            <h2 class="modal-title" v-else>Update Assignment</h2>

            <div class="input-fields" v-if="!loadingData">
                <input placeholder="Title" type="text" class="text" v-model="assignmentData.title">
                <textarea placeholder="Description (optional)" v-model="assignmentData.description"></textarea>
                <div class="input-row">
                    <DropdownComponent :selected-option="selectedSubject" :options="subjectOptions" style="margin-bottom: 1rem;" @onSelected="updateAssignmentSubjectID" />
                    <input type="date" class="date" :min="generateDate()" v-model="assignmentData.date">
                </div>
            </div>

            <ErrorMessage v-if="errMessage !== ''" :error-msg="errMessage" style="margin-bottom: 1rem;" />

            <button class="light-purple-btn" type="submit" v-if="!loadingData && props.assignmentData === null">Add</button>

            <button class="light-purple-btn" type="submit" v-if="!loadingData && props.assignmentData !== null">Update</button>

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
    import { addAssignment } from '@/composables/assignmentQueries';
    import { updateAssignment } from '@/composables/assignmentQueries';
    import { generateDate } from '@/composables/general';

    const props = defineProps(["assignmentData", "extractedSubject"])
    const emit = defineEmits(['closed', 'listUpdated']);

    const closeModal = (event) => {
        if (event.target === event.currentTarget) {
            emit('closed');
        }
    }

    const userSubjects = ref([])
    const subjectOptions = ref([])
    const assignmentData = ref({})

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

        if(props.assignmentData === null){

            selectedSubject.value = subjectOptions.value[0].value

            assignmentData.value.title = ""
            assignmentData.value.description = ""
            assignmentData.value.subjectID = selectedSubject.value
            assignmentData.value.date = null
            assignmentData.value.completion = false

        } else {

            selectedSubject.value = props.extractedSubject

            assignmentData.value.description = props.assignmentData.description
            assignmentData.value.title = props.assignmentData.title
            assignmentData.value.subjectID = props.assignmentData.subjectID
            assignmentData.value.date = props.assignmentData.date
            assignmentData.value.completion = props.assignmentData.completion
            
            cardID.value = props.assignmentData.id

        }


        loadingData.value = false
    })

    const updateAssignmentSubjectID = (value) => {
        selectedSubject.value = value
        assignmentData.value.subjectID = value
    }


    const handleConfirm = () => {
        if(props.assignmentData === null){
            handleInsert()
        } else {
            handleUpdate()
        }
    }

    assignmentData.value.date == null
    const errMessage = ref("")
    const handleInsert = async () => {
        errMessage.value = ""
        if(assignmentData.value.title.trim() == ""){
            errMessage.value = "Title Cannot Be Empty"
            return;
        } else if (assignmentData.value.date == null){
            errMessage.value = "Please Select a Date"
            return;
        } 
    
        try {
            await addAssignment(assignmentData.value);
            emit("closed");
            emit("listUpdated")
        } catch (error) {
            alert("Failed to add exam. Please try again.");
        }
    
    };

    const handleUpdate = async () => {
        errMessage.value = ""
        if(assignmentData.value.date == null){
            errMessage.value = "Please Select a Date"
            return;
        }
    
        try {
            console.log(assignmentData.value)
            await updateAssignment(cardID.value, assignmentData.value);
            emit("closed");
            emit("listUpdated")
        } catch (error) {
            alert("Failed to add exam. Please try again.");
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
        margin-top: 1rem;
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