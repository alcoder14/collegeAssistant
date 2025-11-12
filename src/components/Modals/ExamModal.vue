<template>
    <main class="modal-container"  @click="closeModal($event)">
        <form class="modal-window" @submit.prevent="handleConfirm">
            <h2 class="modal-title">New Exam</h2>

            <div class="input-fields" v-if="!loadingData">
                <div class="input-column">
                    <input type="date" class="date" v-model="examData.date">
                    <DropdownComponent :selected-option="selectedType" :options="typeOptions" style="margin-bottom: 1rem;" @onSelected="updateExamType" />
                    <DropdownComponent :selected-option="selectedSubject" :options="subjectOptions" v-model="examData.subjectID" @onSelected="updateExamSubjectID" /> 
                </div>
                <textarea placeholder="Description (optional)" v-model="examData.description"></textarea>
            </div>

            <ErrorMessage v-if="errMessage !== ''" :error-msg="errMessage" style="margin-top: 1rem;" />

            <button class="light-purple-btn" type="submit" style="margin-top: 1rem;" v-if="!loadingData">Confirm</button>

            <div v-if="loadingData"> 
                Loading
            </div>
            
        </form>
    </main>
</template>

<script setup>
    import { defineEmits, ref, onMounted } from 'vue';
    import DropdownComponent from '../Elements/DropdownComponent.vue';
    import ErrorMessage from '../ErrorMessage.vue';
    import { getUserSubjects } from '@/composables/scheduleQueries';
    import { addExamDate } from '@/composables/examQueries';

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

    const userSubjects = ref([])
    const subjectOptions = ref([])
    const selectedSubject = ref(null)
    const examData = ref({})

    const loadingData = ref(true)

    onMounted( async () => {
        userSubjects.value = await getUserSubjects()
        
        userSubjects.value.forEach((subject) => {
            subjectOptions.value.push({
                value: subject.id,
                visibleValue: subject.subjectName
            })
        })

        selectedSubject.value = subjectOptions.value[0].value

        examData.value.subjectID = selectedSubject.value
        examData.value.type = selectedType.value
        examData.value.date = null
        examData.value.description = ""

        loadingData.value = false
    })


    const updateExamType = (value) => {
        examData.value.type = value
    }
    const updateExamSubjectID = (value) => {
        examData.value.subjectID = value
    }


    const errMessage = ref("")
    const handleConfirm = async () => {
        errMessage.value = ""
        if(examData.value.date == null){
            errMessage.value = "Please Select a Date"
            return;
        }
    
        try {
            await addExamDate(examData.value);
            emit("closed");
            emit("listUpdated")
        } catch (error) {
            alert("Failed to add exam. Please try again.");
        }
    
    };


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