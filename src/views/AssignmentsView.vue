<template>
    <HeaderDesktop />
    <div class="flex-container">
        <DesktopNavbar :selected="'AssignmentsView'" />

        <main class="view-blank">
            <div class="view-container">

                <div class="assignments-interface interface">
                    <div class="management-row">
                        <div class="left-side">
                            <h2 class="container-title">Assignments</h2>
                            <button @click="toggleAssignmentModal"><font-awesome-icon icon="fa fa-plus" /> New</button>
                        </div>
                        <div class="right-side">
                            <DropdownComponent :options="subjectOptions" :selected-option="selectedSubject" @closed="toggleAssignmentModal" @onSelected="setNewSelected"/>
                        </div>
                    </div>

                    <div class="assignments-container container" v-if="assignmentsData.length > 0">
                        <div class="assignment-card" v-for="(item, i) in filteredAssignmentsData" :key="item.id" :style="{borderBottomColor: item.color}">
                            <div class="left-side">
                                <h3 :style="{color: item.color}">Due: {{ item.date }}</h3>
                                <h4>Task: {{ item.title }}</h4>
                                <h5>Subject: {{ item.subjectName }}</h5>
                            </div>
                            <div class="right-side">
                                <button><font-awesome-icon icon="fa fa-pen" @click="extractCardData(i, item.subjectID)" /></button>
                                <button><font-awesome-icon icon="fa fa-trash" @click="removeAssignment(item.id)" /></button>
                            </div>
                        </div>
                    </div>

                </div>
        
            </div>
        </main>

    </div>

    <!-- Add Mode -->
    <AssignmentModal @closed="toggleAssignmentModal" @listUpdated="prepareData" v-if="assignmentModalVisible" :assignmentData="null"/>

    <!-- Update Mode -->
    <AssignmentModal @closed="toggleUpdateAssignmentModal" @listUpdated="prepareData" v-if="updateAssignmentModalVisible" :assignmentData="assignments[cardNumber]" :extractedSubject="cardSubject" />

</template>

<script setup>
    import HeaderDesktop from '@/components/Elements/HeaderDesktop.vue';
    import DesktopNavbar from '@/components/Elements/DesktopNavbar.vue';
    import DropdownComponent from '@/components/Elements/DropdownComponent.vue';
    import { ref, onMounted } from "vue"

    import { getUserAssignments, deleteDueAssignment } from '@/composables/assignmentQueries';
    import { getUserSubjects } from '@/composables/scheduleQueries';
    import AssignmentModal from '@/components/Modals/AssignmentModal.vue';

    const assignmentModalVisible = ref(false)
    const toggleAssignmentModal = () =>{
        assignmentModalVisible.value = !assignmentModalVisible.value
    }

    const cardSubject = ref(null)
    let cardNumber;

    const extractCardData = (card, subject) => {
        cardNumber = card
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
                        color: subject.color
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

</style>