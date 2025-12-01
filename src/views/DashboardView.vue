<template>
    
    <div class="dashboard-container" v-if="!loading">

        <div class="today-schedule">
            <div class="box-title"><h2>TODAY</h2></div>

            <div class="box-content" v-if="todaysLectures.length > 0">
                <h1 class="today">{{ dayWord }}, {{ date }}</h1>

                <div class="lecture-container" v-for="lecture in todaysLectures" :key="lecture.id">

                    <div class="top-row" :class="{'current-lecture': lecture.currentStatus === 'in progress'}">
                        <div class="status-icon">
                            <font-awesome-icon icon="fa fa-check" v-if="lecture.currentStatus === 'completed'" />
                            <font-awesome-icon icon="fa fa-clock" v-if="lecture.currentStatus === 'in progress'" class="clock-icon" />
                            <font-awesome-icon icon="fa fa-table-cells-large" v-if="lecture.currentStatus === 'upcoming'" />
                        </div>
                        <div class="time">{{ lecture.startHour }}</div>
                        <div class="subject-name">{{ lecture.subjectName }}</div>
                    </div>
                    <div class="bottom-row" v-if="lecture.currentStatus ==='in progress'">
                        <div class="progress-bar">
                            <div class="progress" :style="{width: progression + '%'}"></div>
                        </div>
                    </div>

                </div>

            </div>

            <div class="placeholder" v-else>
                <p>No Lectures Today</p>
            </div>

        </div>

        <div class="data-box-container">    
            <div class="data-box">
                <div class="box-title">
                    <h2>LAST NOTE</h2>
                    <router-link to="/notes"><button> Manage </button></router-link>
                </div>
                <div class="box-content" v-if="notes.length > 0">
                    <div class="content-subject">
                        <p class="content-subject-text" :style="{backgroundColor: lastNote.color}">{{ lastNote.subjectName }}</p>
                    </div>
                    <h2 class="content-bold">{{ lastNote.title }}</h2>
                    <h4 class="content-light">{{ transformDate(lastNote.date) }} at {{ lastNote.time }}</h4>
                    <div v-html="lastNote.content" v-if="lastNote.content.trim() !== ''" class="content-content"></div>
                </div>
                <div class="placeholder" v-else>
                    <p>No Notes To Show</p>
                </div>
            </div>
            <div class="data-box">
                <div class="box-title">
                    <h2>NEXT ASSIGNMENT</h2>
                    <router-link to="/assignments"><button> Manage </button></router-link>
                </div>
                <div class="box-content" v-if="assignments.length > 0">
                    <div class="content-subject">
                        <p class="content-subject-text" :style="{backgroundColor: nextAssignment.color}">{{ nextAssignment.subjectName }}</p>
                    </div>
                    <h2 class="content-bold"> Due: {{ transformDate(nextAssignment.date) }}</h2>
                    <h4 class="content-light">{{ nextAssignment.title }}</h4>
                    <div v-html="nextAssignment.description" v-if="nextAssignment.description.trim() !== ''" class="content-content"></div>
                </div>
                <div class="placeholder" v-else>
                    <p>No Upcoming Assignments</p>
                </div>
            </div>
            <div class="data-box">
                <div class="box-title">
                    <h2>NEXT TEST</h2>
                    <router-link to="/tests"><button> Manage </button></router-link>
                </div>
                <div class="box-content" v-if="tests.length > 0">
                    <div class="content-subject">
                        <p class="content-subject-text" :style="{backgroundColor: nextTest.color}">{{ nextTest.subjectName }}</p>
                    </div>
                    <h2 class="content-bold">{{ transformDate(nextTest.date) }}</h2>
                    <h4 class="content-light">{{ nextTest.type }}</h4>
                </div>
                <div class="placeholder" v-else>
                    <p>No Upcoming Tests</p>
                </div>
            </div>
        </div>


    </div>

    <div class="dashboard-loader" v-else>
        <atom-spinner :animation-duration="1000" :size="100" color="#55DFD4"/>
        <p style="margin-top: 1rem">Loading</p>
    </div>
           
</template>

<script setup>
    import { getUserSchedule, getUserSubjectPositions, getUserSubjects } from '@/composables/scheduleQueries';
    import { getUserNotes } from '@/composables/noteQueries';
    import { getUserTests } from '@/composables/examQueries';
    import { getUserAssignments } from '@/composables/assignmentQueries';
    import { AtomSpinner } from 'epic-spinners';
    import { transformDate } from '@/composables/general';

    import { onMounted, ref } from 'vue';
    import { compareDateToToday } from '@/composables/general';

    const loading = ref(true)

    onMounted( async () => {
        getTime() // get current time
        getToday() // get current day - numeric and string values
        getScheduleData() // get starting time for user's schedule
        
        await getTodaysPositions()

        await Promise.all([loadNotes(), loadAssignments(), loadTests()])
        loading.value = false
    })

    const scheduleData = ref()
    const startHour = ref()

    const getScheduleData = async () => {
        scheduleData.value = await getUserSchedule()
        startHour.value = scheduleData.value[0].startHour
    }

    const hours = ref()
    const minutes = ref()
    const progression = ref()

    const getTime = () => {
        const now = new Date();
        hours.value = now.getHours()
        minutes.value = now.getMinutes()
        progression.value = minutes.value / 60 * 100
    }

    const dayNumber = ref()
    const dayWord = ref()
    const date = ref()

    const getToday = () => {

        const now = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        dayWord.value = days[now.getDay()];
        date.value = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
        dayNumber.value = now.getDay() === 0 ? 6 : now.getDay();
    }

    const subjectPositions = ref()
    const subjects = ref()
    const todaysPositions = ref([])
    const todaysLectures = ref([])

    const getTodaysPositions = async () => {
        subjects.value = await getUserSubjects()
        subjectPositions.value = await getUserSubjectPositions()

        subjectPositions.value.forEach((subjectPosition) => {
                if(subjectPosition.xPosition === dayNumber.value){
                    todaysPositions.value.push(subjectPosition)
                }
        })

        todaysPositions.value.forEach((position) => {
            subjects.value.forEach((subject) => {
                if(position.subjectID === subject.id){

                    let startHourNumber = parseInt(startHour.value[1])
                    startHourNumber = startHourNumber + position.yPosition
                    let startHourString = "";

                    let status;
                    if(startHourNumber < hours.value){
                        status = "completed"
                    } else if (startHourNumber === hours.value){
                        status = "in progress"
                    } else {
                        status = "upcoming"
                    }
                    
                    if(startHourNumber > 9){
                        startHourString = startHourNumber.toString() + ":00"
                    } else {
                        startHourString = "0" + startHourNumber.toString() + ":00"
                    }

                    console.log("Start Hour Number: " + startHourNumber)

                    todaysLectures.value.push({
                        ...position,
                        subjectName: subject.subjectName,
                        subjectShortName: subject.subjectShortName,
                        startHour: startHourString,
                        currentStatus: status 
                    })
                }
            })
        })

        todaysLectures.value = todaysLectures.value.sort((a, b) => a.yPosition - b.yPosition)

        console.log("TODAY'S LECTURES: ")
        console.log(todaysLectures.value)
    }

    const notes = ref()
    const lastNote = ref()
    const loadNotes = async () => {
    
        notes.value = await getUserNotes()
        notes.value = notes.value.sort((a, b) => {
            const [da, ma, ya] = a.date.split('-').map(Number);
            const [db, mb, yb] = b.date.split('-').map(Number);

            const [ha, mina] = a.time.split(':').map(Number);
            const [hb, minb] = b.time.split(':').map(Number);

            return new Date(ya, ma - 1, da, ha, mina) -
                    new Date(yb, mb - 1, db, hb, minb);
        });

        console.log("NOTES: ")
        console.log(notes.value)

        if(notes.value.length > 0){
            lastNote.value = notes.value[notes.value.length - 1]
            console.log(lastNote.value)

            lastNote.value = {
                ...lastNote.value,
                subjectName: getSubjectName(lastNote.value.subjectID),
                color: getSubjectColor(lastNote.value.subjectID)
            }
            
            console.log(lastNote.value)
        }

    }

    const assignments = ref()
    const nextAssignment = ref()
    const loadAssignments = async () => {

        assignments.value = await getUserAssignments()
        assignments.value = assignments.value.filter((assignment) => assignment.completion === false && compareDateToToday(assignment.date) !== "past")

        assignments.value = assignments.value.sort((a, b) => {
            const [da, ma, ya] = a.date.split('-').map(Number);
            const [db, mb, yb] = b.date.split('-').map(Number);

            return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
        });

        if(assignments.value.length > 0){

            nextAssignment.value = assignments.value[0]

            nextAssignment.value = {
                ...nextAssignment.value,
                subjectName: getSubjectName(nextAssignment.value.subjectID),
                color: getSubjectColor(nextAssignment.value.subjectID)
            }
        }

    }

    const tests = ref()
    const nextTest = ref()
    const loadTests = async () => {

        tests.value = await getUserTests()
        tests.value = tests.value.filter((test) => compareDateToToday(test.date) !== "past")

        tests.value = tests.value.sort((a, b) => {
            const [da, ma, ya] = a.date.split('-').map(Number);
            const [db, mb, yb] = b.date.split('-').map(Number);

            return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
        });

        console.log("TESTS: ")
        console.log(tests.value)

        if(tests.value.length > 0){
            nextTest.value = tests.value[0]

            nextTest.value = {
                ...nextTest.value,
                subjectName: getSubjectName(nextTest.value.subjectID),
                color: getSubjectColor(nextTest.value.subjectID)
            }
        }
    }

    const getSubjectName = (subjectID) => {
        console.log("Subject ID: " + subjectID)
        for (const subject of subjects.value) {
            if (subject.id === subjectID) {
                return subject.subjectName;
            }
        }
        return null;
    }

    const getSubjectColor = (subjectID) => {
        console.log("Subject ID: " + subjectID)
        for (const subject of subjects.value) {
            if (subject.id === subjectID) {
                return subject.color;
            }
        }
        return null;
    }

</script>

<style lang="scss" scoped>
      @import "@/assets/style.scss";
      .dashboard-loader{
        width: 100%;
        min-height: 83vh;
        background-color: $darkest;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        p{
            font-size: 2rem;
            color: $white;
        }
      }
      .dashboard-container{
        width: 100%;
        min-height: 83vh;
        background-color: $dark;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .today-schedule, .data-box-container{
        width: 49.5%;
      }
      .today-schedule, .data-box{
        background-color: $darkest;
        display: flex;
        flex-direction: column;
      }
      .data-box{
        margin-bottom: 1rem;
      }
      .box-title{
        background-color: $light;
        padding: 0.8rem;
        display: flex;
        justify-content: space-between;
      }
      .box-content{
        padding: 1rem;
        color: $white;
        .content-subject{
            display: inline-block;
            margin-bottom: 0.4rem;
            .content-subject-text{
                padding: 0.4rem;
            }
        }
        .content-bold{
            font-weight: 600;
            text-transform: capitalize;
            margin-bottom: 0.2rem;
        }
        .content-light{
            font-weight: 300;
            text-transform: capitalize;
        }
        .content-content{
            margin-top: 0.6rem;
        }
      }
      .placeholder{
           flex: 1;                 
           display: flex;           
           justify-content: center; 
           align-items: center;     
           text-align: center; 
           font-size: 1.4rem;
           color: $white;
           padding: 4rem;
      }
      .today{
        color: $white;
        font-weight: lighter;
        margin-bottom: 1.5rem;
      }

      .current-lecture{
        font-size: 2rem;
        margin-top: 1rem;
        color: $white;
      }
      .lecture-container{
        display: flex;
        flex-direction: column;
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
        color: #7c7c7c;
        .top-row{
            display: flex;
            flex-direction: row;
            justify-content: start;
            .time{
                width: 20%;
            }
            .status-icon{
                width: 10%;
            }
        }
        .bottom-row{
            margin-bottom: 1rem;
            .progress-bar{
                margin-top: 0.5rem;
                width: 80%;
                height: 30px;
                background-color: $dark;
                .progress{
                    height: inherit;
                    background-color: $light;
                }
            }
        }
      }

      @media(max-width: 900px){
        .dashboard-container{
            flex-direction: column;
            justify-content: start;
        }
        .today-schedule, .data-box-container{
            width: 100%;
        }
        .today-schedule{
            margin-bottom: 1.5rem;
        }
      }

      @media(max-width: 550px){
        .current-lecture{
            font-size: 1.5rem;
        }
      }
</style>