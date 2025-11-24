<template>
    <HeaderDesktop />
    <div class="flex-container">
        <DesktopNavbar :selected="'AssignmentsView'" />

        <main class="view-blank">
            <div class="view-container">

                <div class="assignments-interface interface">
                    <div class="management-row">
                        <div class="left-side">
                            <h2 class="interface-title">Assignments</h2>
                            <button @click="toggleAssignmentModal"><font-awesome-icon icon="fa fa-plus" /> New</button>
                        </div>
                        <div class="right-side">
                            <DropdownComponent :options="subjectOptions" :selected-option="selectedSubject" @closed="toggleAssignmentModal" @onSelected="setNewSelected"/>
                        </div>
                    </div>

                    <div class="outer-container" v-if="assignmentsData.length > 0">

                        <div class="inner-container" v-if="dueAssignments.length > 0">

                            <div class="top-row">
                                <h1>Due</h1>
                                <div class="line"></div>
                            </div>

                            <div class="inner-box-container">
                                <div class="assignment-card" v-for="(item) in dueAssignments" :key="item.id" :style="{borderBottomColor: item.color}">
                                    <div class="left-side">
                                        <h3 :style="{color: item.color}" v-if="compareDateToToday(item.date) === 'today'">Due: Today</h3>
                                        <h3 :style="{color: item.color}" v-else>Due: {{ item.date }}</h3>
                                        <h4>Task: {{ item.title }}</h4>
                                        <h5>Subject: {{ item.subjectName }}</h5>
                                        <button class="completion-btn" @click="updateCompletion(item.id, true)">Mark Completed</button>
                                    </div>
                                    <div class="right-side">
                                        <button><font-awesome-icon icon="fa fa-pen" @click="extractCardData(item.id, item.subjectID)" /></button>
                                        <button><font-awesome-icon icon="fa fa-trash" @click="removeAssignment(item.id)" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="inner-container" v-if="pastDueAssignments.length > 0">

                            <div class="top-row">
                                <h1><font-awesome-icon icon="fa fa-exclamation-circle" /> Past Due</h1>
                                <div class="line"></div>
                            </div>

                            <div class="inner-box-container">
                                <div class="assignment-card" v-for="(item) in pastDueAssignments" :key="item.id" :style="{borderBottomColor: item.color}">
                                    <div class="left-side">
                                        <h3 :style="{color: item.color}">Due: {{ item.date }}</h3>
                                        <h4>Task: {{ item.title }}</h4>
                                        <h5>Subject: {{ item.subjectName }}</h5>
                                        <button class="completion-btn" @click="updateCompletion(item.id, true)">Mark Completed</button>
                                    </div>
                                    <div class="right-side">
                                        <button><font-awesome-icon icon="fa fa-pen" @click="extractCardData(item.id, item.subjectID)" /></button>
                                        <button><font-awesome-icon icon="fa fa-trash" @click="removeAssignment(item.id)" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="inner-container" v-if="completedAssignments.length > 0">

                            <div class="top-row">
                                <h1><font-awesome-icon icon="fa fa-check" /> Completed</h1>
                                <div class="line"></div>
                            </div>

                            <div class="inner-box-container">
                                <div class="assignment-card" v-for="(item) in completedAssignments" :key="item.id" :style="{borderBottomColor: item.color}">
                                    <div class="left-side">
                                        <h3 :style="{color: item.color}" v-if="compareDateToToday(item.date) === 'today'">Due: Today</h3>
                                        <h3 :style="{color: item.color}" v-else>Due: {{ item.date }}</h3>
                                        <h4>Task: {{ item.title }}</h4>
                                        <h5>Subject: {{ item.subjectName }}</h5>
                                        <button class="completion-btn" @click="updateCompletion(item.id, false)">Unmark Completed</button>
                                    </div>
                                    <div class="right-side">
                                        <button><font-awesome-icon icon="fa fa-pen" @click="extractCardData(item.id, item.subjectID)" /></button>
                                        <button><font-awesome-icon icon="fa fa-trash" @click="removeAssignment(item.id)" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="placeholder" v-if="pastDueAssignments.length == 0 && dueAssignments.length == 0 && completedAssignments.length === 0 && !loadingData">
                        No Assignments To Show
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
    <AssignmentModal @closed="toggleAssignmentModal" @listUpdated="prepareData" v-if="assignmentModalVisible" :assignmentData="null"/>

    <!-- Update Mode -->
    <AssignmentModal @closed="toggleUpdateAssignmentModal" @listUpdated="prepareData" v-if="updateAssignmentModalVisible" :assignmentData="chosenCard" :extractedSubject="cardSubject" />

</template>

<script setup>
    import HeaderDesktop from '@/components/Elements/HeaderDesktop.vue';
    import DesktopNavbar from '@/components/Elements/DesktopNavbar.vue';
    import DropdownComponent from '@/components/Elements/DropdownComponent.vue';
    import { ref, onMounted } from "vue"

    import { getUserAssignments, deleteDueAssignment, updateAssignmentCompletion } from '@/composables/assignmentQueries';
    import { getUserSubjects } from '@/composables/scheduleQueries';
    import AssignmentModal from '@/components/Modals/AssignmentModal.vue';
    import { compareDateToToday } from '@/composables/general';
    import { AtomSpinner } from 'epic-spinners';

    const assignmentModalVisible = ref(false)
    const toggleAssignmentModal = () =>{
        assignmentModalVisible.value = !assignmentModalVisible.value
    }

    const cardSubject = ref(null)
    const chosenCard = ref(null);

    const extractCardData = (id, subject) => {
        chosenCard.value = assignments.value.find((assignment) => assignment.id === id)
        cardSubject.value = subject
        toggleUpdateAssignmentModal()
    }


    const updateAssignmentModalVisible = ref(false)
    const toggleUpdateAssignmentModal = () =>{
        updateAssignmentModalVisible.value = !updateAssignmentModalVisible.value
    }

    onMounted( () => {
        prepareData()
    })

    const prepareData = async () => {
        await Promise.all([loadAssignments(), loadSubjects()])
        compileAssignmentData()
    }

    const assignments = ref()
    const loadAssignments = async () => {
        assignments.value = await getUserAssignments()
        console.log("here the assignments be:")
        console.log(assignments.value)
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

    const assignmentsData = ref([])
    const compileAssignmentData = () => {
        assignmentsData.value = []
        assignments.value.forEach((assignment) => {
            subjects.value.forEach((subject) => {
                if(assignment.subjectID === subject.id){
                    assignmentsData.value.push({
                        ...assignment,
                        subjectName: subject.subjectName,
                        subjectID: subject.id,
                        color: subject.color,
                        timeStatus: compareDateToToday(assignment.date)
                    })
                }
            })
        })

        console.log("BELOW:")
        console.log(assignmentsData.value)
        filterByType()
    }

    const removeAssignment = async (id) => {
        assignmentsData.value = assignmentsData.value.filter((assignment) => assignment.id !== id)
        filteredAssignmentsData.value = filteredAssignmentsData.value.filter((assignment) => assignment.id !== id)
        filterByCategory(filteredAssignmentsData.value)
        await deleteDueAssignment(id)
    }

    const selectedSubject = ref("all")
    const setNewSelected = (value) => {
        selectedSubject.value = value
        filterByType()
    }

    const filteredAssignmentsData = ref([])
    const filterByType = () => {
        if (selectedSubject.value === "all") {
            filteredAssignmentsData.value = assignmentsData.value
        } else {
            filteredAssignmentsData.value = assignmentsData.value.filter(assignment => assignment.subjectID === selectedSubject.value)
        }
        filterByCategory(filteredAssignmentsData.value)
    }

    const dueAssignments = ref([])
    const completedAssignments = ref([])
    const pastDueAssignments = ref([])

    const loadingData = ref(true)

    const filterByCategory = (assignments) => {
        dueAssignments.value = []
        completedAssignments.value = []
        pastDueAssignments.value = []

        assignments.forEach((assignment) => {
            if(assignment.completion === true){
                completedAssignments.value.push(assignment)
            } else if(assignment.completion === false && assignment.timeStatus === "past"){
                pastDueAssignments.value.push(assignment)
            } else if (assignment.completion === false && assignment.timeStatus !== "past"){
                dueAssignments.value.push(assignment)
            }
        })

        loadingData.value = false
    }
    
    const updateCompletion = async (id, value) => {
        assignmentsData.value.forEach((assignment) => {
            if(assignment.id === id){
                assignment.completion = value
            }
        })
        filteredAssignmentsData.value.forEach((assignment) => {
            if(assignment.id === id){
                assignment.completion = value
            }
        })

        filterByCategory(filteredAssignmentsData.value)

        let assignmentToUpdate = assignmentsData.value.find((assignment) => assignment.id === id)

        await updateAssignmentCompletion(id, assignmentToUpdate)
    }

</script>

<style lang="scss" scoped>
      @import "@/assets/style.scss";
      .assignment-card{
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
        h3{
            margin-bottom: 1rem;
        }
        h4{
            margin-bottom: 0.3rem;
        }
      }
      .completion-btn{
        margin-top: 1rem;
        font-size: 0.7rem;
      }

</style>