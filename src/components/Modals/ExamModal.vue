<template>
    <main class="modal-container"  @click="closeModal($event)">
        <form class="modal-window exam-window" @submit.prevent="handleConfirm">
            <h2 class="modal-title" v-if="props.examData === null">New Test</h2>
            <h2 class="modal-title" v-else>Update Test</h2>

            <div class="input-fields" v-if="!loadingData">
                <input type="date" class="date" v-model="examData.date" style="margin-bottom: 1rem;" >
                <DropdownComponent :selected-option="selectedType" :options="typeOptions" style="margin-bottom: 1rem;" @onSelected="updateExamType" />
                <DropdownComponent :selected-option="selectedSubject" :options="subjectOptions" v-model="examData.subjectID" @onSelected="updateExamSubjectID" style="margin-bottom: 1rem;" /> 
            </div>

            <ErrorMessage v-if="errMessage !== ''" :error-msg="errMessage" style="margin-bottom: 1rem;" />

            <button class="light-purple-btn" type="submit" v-if="!loadingData && props.examData === null">Add</button>

            <button class="light-purple-btn" type="submit" v-if="!loadingData && props.examData !== null">Update</button>

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
    import { addTest } from '@/composables/examQueries';
    import { updateTest } from '@/composables/examQueries';

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

    const props = defineProps(["examData", "extractedSubject", "extractedType"])
    const emit = defineEmits(['closed', 'listUpdated']);

    const closeModal = (event) => {
        if (event.target === event.currentTarget) {
            emit('closed');
        }
    }

    const userSubjects = ref([])
    const subjectOptions = ref([])
    const examData = ref({})

    const cardID = ref()
    const selectedSubject = ref(null)
    const selectedType = ref(null)

    const loadingData = ref(true)

    onMounted( async () => {
        userSubjects.value = await getUserSubjects()
        userSubjects.value.forEach((subject) => {
            subjectOptions.value.push({
                value: subject.id,
                visibleValue: subject.subjectName
            })
        })

        if(props.examData === null){

            selectedSubject.value = subjectOptions.value[0].value
            selectedType.value = "exam"

            console.log(props.extractedType)

            examData.value.type = "exam"
            examData.value.subjectID = selectedSubject.value
            examData.value.date = null
            examData.value.result = null

        } else {

            selectedSubject.value = props.extractedSubject
            selectedType.value = props.extractedType

            console.log(props.examData.type)


            examData.value.type = props.examData.type
            examData.value.subjectID = props.examData.subjectID
            examData.value.date = props.examData.date
            
            cardID.value = props.examData.id

        }


        loadingData.value = false
    })


    const updateExamType = (value) => {
        selectedType.value = value
        examData.value.type = value
    }
    const updateExamSubjectID = (value) => {
        selectedSubject.value = value
        examData.value.subjectID = value
    }


    const handleConfirm = () => {
        if(props.examData === null){
            handleInsert()
        } else {
            handleUpdate()
        }
    }


    const errMessage = ref("")
    const handleInsert = async () => {
        errMessage.value = ""
        if(examData.value.date == null){
            errMessage.value = "Please Select a Date"
            return;
        }
    
        try {
            await addTest(examData.value);
            emit("closed");
            emit("listUpdated")
        } catch (error) {
            alert("Failed to add exam. Please try again.");
        }
    
    };

    const handleUpdate = async () => {
        errMessage.value = ""
        if(examData.value.date == null){
            errMessage.value = "Please Select a Date"
            return;
        }
    
        try {
            console.log(examData.value)
            await updateTest(cardID.value, examData.value);
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
      @media(max-width: 601px){
        .exam-window{
            width: 100%;
        }
      }
      .input-fields{
        display: flex;
        flex-direction: column;
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
        resize: vertical;
        font-size: 1rem;
      }
      .date{
        font-size: 1rem;
        padding: 6px 10px;
        background-color: $dark;
        color: $white;
        border: solid 2px $darkest;
      }
</style>