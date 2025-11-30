<template>
    <div class="exams-interface interface">
        <div class="management-row">
            <div class="left-side">
                <h2 class="interface-title">Tests</h2>
                <font-awesome-icon icon="fa fa-plus" @click="toggleExamModal" class="interface-add-btn" />
            </div>
            <div class="right-side">
                <DropdownComponent :options="typeOptions" :selected-option="selectedType" @closed="toggleExamModal" @onSelected="setNewSelected"/>
            </div>
        </div>

        <div class="mobile-navigator" v-if="mobileNavigatorVisible">
            <button @click="toggleVisibleCards('today')" :class="{'selected-btn': visibleCardType === 'today'}">Today</button>
            <button @click="toggleVisibleCards('upcoming')" :class="{'selected-btn': visibleCardType === 'upcoming'}">Upcoming</button>
            <button @click="toggleVisibleCards('past')" :class="{'selected-btn': visibleCardType === 'past'}">Past</button>
        </div>

        <div class="outer-container" v-if="examsData.length > 0 ">

            <div class="inner-container" v-if="todayExams.length > 0 && (visibleCardType === 'today' || visibleCardType === 'all')">

                <div class="top-row">
                    <h1>Today</h1>
                    <div class="line"></div>
                </div>

                <div class="inner-box-container">
                    <div class="exam-card" v-for="(item) in todayExams" :key="item.id" :style="{borderBottomColor: item.color}">

                        <div class="left-side">
                            <h3 :style="{color: item.color}"> {{ item.date }}</h3>
                            <h4 :style="{color: item.color}" style="text-transform: capitalize;">{{ item.type }}</h4>
                            <h4>{{ item.subjectName }}</h4>
                            <h5>{{ item.description }}</h5>
                        </div>

                        <div class="right-side">
                            <button><font-awesome-icon icon="fa fa-pen" @click="extractCardData(item.id, item.subjectID, item.type)" /></button>
                            <button><font-awesome-icon icon="fa fa-trash" @click="removeExam(item.id)" /></button>
                        </div>

                    </div>
                </div>

            </div>

            <div class="inner-container" v-if="futureExams.length > 0 && (visibleCardType === 'upcoming' || visibleCardType === 'all')">
                <div class="top-row">
                    <h1>Upcoming</h1>
                    <div class="line"></div>
                </div>

                <div class="inner-box-container">
                    <div class="exam-card" v-for="(item) in futureExams" :key="item.id" :style="{borderBottomColor: item.color}">

                        <div class="left-side">
                            <h3 :style="{color: item.color}"> {{ item.date }}</h3>
                            <h4 :style="{color: item.color}" style="text-transform: capitalize;">{{ item.type }}</h4>
                            <h4>{{ item.subjectName }}</h4>
                            <h5>{{ item.description }}</h5>
                        </div>

                        <div class="right-side">
                            <button><font-awesome-icon icon="fa fa-pen" @click="extractCardData(item.id, item.subjectID, item.type)" /></button>
                            <button><font-awesome-icon icon="fa fa-trash" @click="removeExam(item.id)" /></button>
                        </div>

                    </div>
                </div>
            </div>

            <div class="inner-container" v-if="pastExams.length > 0 && (visibleCardType === 'past' || visibleCardType === 'all')">
                <div class="top-row">
                    <h1>Past</h1>
                    <div class="line"></div>
                </div>

                <div class="inner-box-container">
                    <div class="exam-card" v-for="(item) in pastExams" :key="item.id" :style="{borderBottomColor: item.color}">

                        <div class="left-side">
                            <h3 :style="{color: item.color}"> {{ item.date }}</h3>
                            <h4 :style="{color: item.color}" style="text-transform: capitalize;">{{ item.type }}</h4>
                            <h4>{{ item.subjectName }}</h4>
                            <h5>{{ item.description }}</h5>
                            <div class="result-options" v-if="item.result === null">
                                <button class="result-btn" style="margin-right: 0.2rem;" @click="updateResult(item.id, 'success')"><font-awesome-icon icon="fa fa-check"/> Passed</button>
                                <button class="result-btn" @click="updateResult(item.id, 'failure')"><font-awesome-icon icon="fa fa-xmark"/> Failed</button>
                            </div>
                            <div class="result-message" v-if="item.result === 'success'">
                                <p><font-awesome-icon icon="fa fa-check"/> Passed</p>
                                <button class="result-btn" @click="updateResult(item.id, null)">Undo</button>
                            </div>
                            <div class="result-message" v-if="item.result === 'failure'">
                                <p><font-awesome-icon icon="fa fa-xmark"/> Failed</p>
                                <button class="result-btn" @click="updateResult(item.id, null)">Undo</button>
                            </div>
                        </div>

                        <div class="right-side">
                            <button><font-awesome-icon icon="fa fa-pen" @click="extractCardData(item.id, item.subjectID, item.type)" /></button>
                            <button><font-awesome-icon icon="fa fa-trash" @click="removeExam(item.id)" /></button>
                        </div>

                    </div>
                </div>
            </div> 

        </div>      
        
        <div class="placeholder" v-if="futureExams.length == 0 && todayExams.length == 0 && pastExams.length === 0 && !loadingData">
            No Tests To Show
        </div>

        <div class="loader" v-if="loadingData">
            <atom-spinner :animation-duration="1000" :size="100" color="#55DFD4"/>
            <p style="margin-top: 1rem">Loading</p>
        </div>


    </div>

    <!-- Add Mode -->
    <ExamModal @closed="toggleExamModal" @listUpdated="prepareData" v-if="examModalVisible" :examData="null" :extractedSubject="null" extractedType="exam"  />

    <!-- Update Mode -->
    <ExamModal @closed="toggleUpdateExamModal" @listUpdated="prepareData" v-if="updateExamModalVisible" :examData="chosenCard" :extractedSubject="cardSubject" :extractedType="cardType" />

</template>

<script setup>
    //import HeaderDesktop from '@/components/Elements/HeaderDesktop.vue';
    //import DesktopNavbar from '@/components/Elements/DesktopNavbar.vue';
    import DropdownComponent from '@/components/Elements/DropdownComponent.vue';
    import ExamModal from '@/components/Modals/ExamModal.vue';
    import { ref, onMounted } from "vue"
    import { getUserExams, deleteExam } from '@/composables/examQueries';
    import { getUserSubjects } from '@/composables/scheduleQueries';
    import { compareDateToToday } from '@/composables/general';
    import { updateExamResult } from '@/composables/examQueries';
    import { AtomSpinner } from 'epic-spinners';

    const examModalVisible = ref(false)
    const toggleExamModal = () =>{
        examModalVisible.value = !examModalVisible.value
    }

    const cardSubject = ref(null)
    const cardType = ref(null)
    const chosenCard = ref(null);

    const extractCardData = (id, subject, type) => {
        chosenCard.value = exams.value.find((exam) => exam.id === id)

        cardSubject.value = subject
        cardType.value = type
        toggleUpdateExamModal()
    }


    const updateExamModalVisible = ref(false)
    const toggleUpdateExamModal = () =>{
        updateExamModalVisible.value = !updateExamModalVisible.value
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
        checkWidth()
        window.addEventListener("resize", checkWidth)

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
                        subjectID: subject.id,
                        color: subject.color,
                        timeStatus: compareDateToToday(exam.date)
                    })
                }
            })
        })

        console.log("BELOW:")
        console.log(examsData.value)
        filterByType()
    }

    const removeExam = async (id) => {
        examsData.value = examsData.value.filter((exam) => exam.id !== id)
        filteredExamsData.value = filteredExamsData.value.filter((exam) => exam.id !== id)
        filterByTimeStatus(filteredExamsData.value)
        await deleteExam(id)
    }

    const setNewSelected = (value) => {
        selectedType.value = value
        filterByType()
    }

    const filteredExamsData = ref([])
    const filterByType = () => {
        if (selectedType.value === "all") {
            filteredExamsData.value = examsData.value
        } else {
            filteredExamsData.value = examsData.value.filter(exam => exam.type === selectedType.value)
        }
        filterByTimeStatus(filteredExamsData.value)
    }

    const pastExams = ref([])
    const todayExams = ref([])
    const futureExams = ref([])
    const loadingData = ref(true)

    const filterByTimeStatus = (exams) => {
        pastExams.value = []
        todayExams.value = []
        futureExams.value = []

        exams.forEach((exam) => {
            if(exam.timeStatus === "past"){
                pastExams.value.push(exam)
            } else if (exam.timeStatus === "today"){
                todayExams.value.push(exam)
            } else {
                futureExams.value.push(exam)
            }
        })

        loadingData.value = false
    }

    const updateResult = async (id, result) => {

        examsData.value.forEach((exam) => {
            if(exam.id === id){
                exam.result = result
            } 
        })

        filteredExamsData.value.forEach((exam) => {
            if(exam.id === id){
                exam.result = result
            }
        })
        pastExams.value.forEach((exam) => {
            if(exam.id === id){
                exam.result = result
            }
        })

        let examToUpdate = examsData.value.find((exam) => exam.id === id)

        await updateExamResult(id, examToUpdate)
    }

    
    const mobileNavigatorVisible = ref(false)
    const visibleCardType = ref(null)

    const checkWidth = () => {
        if(window.innerWidth < 665){
        mobileNavigatorVisible.value = true
        if(visibleCardType.value === null || visibleCardType.value === "all"){
            visibleCardType.value = "today"
        }
        } else {
            mobileNavigatorVisible.value = false
            visibleCardType.value = "all"
        }
    }

    const toggleVisibleCards = (cardType) => {
        visibleCardType.value = cardType
    }
</script>

<style lang="scss" scoped>
      @import "@/assets/style.scss";
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
        h4 {
            margin-bottom: 0.5rem;
        }
      }

      .result-message, .result-options{
        margin-top: 1rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        p{
            margin-right: 0.2rem;
        }
      }
      .result-btn{
        font-size: 0.7rem;
      }

</style>