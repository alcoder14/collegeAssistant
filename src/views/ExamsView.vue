<template>
    <HeaderDesktop />
    <div class="flex-container">
        <DesktopNavbar :selected="'ExamsView'" />

        <main class="view-blank">
            <div class="view-container">

                <div class="exams-interface">
                    <div class="management-row">
                        <div class="left-side">
                            <h2 class="container-title">Exams</h2>
                            <button @click="toggleExamModal"><font-awesome-icon icon="fa fa-plus" /> New</button>
                        </div>
                        <div class="right-side">
                            <DropdownComponent :options="typeOptions" :selected-option="selectedType" @closed="toggleExamModal"/>
                        </div>
                    </div>

                    <div class="exams-container" v-if="examsData.length > 0">
                        <div class="exam-card" v-for="item in examsData" :key="item.id" :style="{borderBottomColor: item.color}">
                            <div class="left-side">
                                <h3>{{ item.subjectName }}</h3>
                                <h4>{{ item.type }}</h4>
                                <h4>{{ item.date }}</h4>
                                <h5>{{ item.description }}</h5>
                            </div>
                            <div class="right-side">
                                <button><font-awesome-icon icon="fa fa-pen" /></button>
                                <button><font-awesome-icon icon="fa fa-trash" @click="removeExam(item.id)" /></button>
                            </div>
                        </div>
                    </div>

                </div>
        
            </div>
        </main>

    </div>

    <ExamModal @closed="toggleExamModal" @listUpdated="prepareData" v-if="examModalVisible" />
</template>

<script setup>
    import HeaderDesktop from '@/components/Elements/HeaderDesktop.vue';
    import DesktopNavbar from '@/components/Elements/DesktopNavbar.vue';
    import DropdownComponent from '@/components/Elements/DropdownComponent.vue';
    import ExamModal from '@/components/Modals/ExamModal.vue';
    import { ref, onMounted } from "vue"
    import { getUserExams, deleteExam } from '@/composables/examQueries';
    import { getUserSubjects } from '@/composables/scheduleQueries';

    const examModalVisible = ref(false)
    const toggleExamModal = () =>{
        examModalVisible.value = !examModalVisible.value
    }

    const typeOptions = ref([
        {
            value: "all",
            visibleValue: "All"
        },
        {
            value: "colloquium",
            visibleValue: "Colloquium"
        }, 
        {
            value: "exam",
            visibleValue: "Exam"
        }
    ])

    const selectedType = ref("all")
        

    onMounted( () => {
        prepareData()
    })

    const prepareData = async () => {
        await Promise.all([loadExams(), loadSubjects()])
        compileExamData()
    }

    const exams = ref()
    const loadExams = async () => {
        exams.value = await getUserExams()
        console.log(exams.value)
    }

    const subjects = ref()
    const loadSubjects = async () => {
        subjects.value = await getUserSubjects()
        console.log(subjects.value)
    }

    const examsData = ref([])
    const compileExamData = () => {
        examsData.value = []
        exams.value.forEach((exam) => {
            subjects.value.forEach((subject) => {
                if(exam.subjectID === subject.id){
                    examsData.value.push({
                        ...exam,
                        subjectName: subject.subjectName,
                        color: subject.color
                    })
                }
            })
        })

        console.log("BELOW:")
        console.log(examsData.value)
    }

    const removeExam = async (id) => {
        await deleteExam(id)
        examsData.value = examsData.value.filter((exam) => exam.id !== id)
    }


</script>

<style lang="scss" scoped>
      @import "@/assets/style.scss";

      .exams-interface{
        background-color: $darkest;
        min-height: 83vh;
      }
      .exams-container{
        margin: 1rem;
        margin-top: 0;
        display: grid;
        grid-template-columns: repeat(5, 19%);
        justify-content: space-between;
      }
      .exam-card{
        padding: 1rem;
        background-color: $dark;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 2px solid;
        margin-bottom: 1rem;
        color: $white;
        h4, h5{
            font-weight: lighter;
        }
        h3, h4 {
            margin-bottom: 0.5rem;
        }
      }

</style>