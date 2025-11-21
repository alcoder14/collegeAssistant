<template>
    <HeaderDesktop />
    <div class="flex-container">
        <DesktopNavbar :selected="'DashboardView'" />
        <main class="view-blank">
            <div class="view-container">
                <div class="dashboard-container" v-if="!loading">

                    <div class="today-schedule">
                        <div class="box-title"><h2>TODAY</h2></div>
                        <div class="box-content">
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
                    </div>

                    <div class="data-box">
                        <div class="box-title"><h2>LAST NOTE</h2></div>
                        <div class="box-content"></div>
                    </div>
                    <div class="data-box">
                        <div class="box-title"><h2>NEXT ASSIGNMENT</h2></div>
                        <div class="box-content"></div>
                    </div>
                    <div class="data-box">
                        <div class="box-title"><h2>NEXT TEST</h2></div>
                        <div class="box-content"></div>
                    </div>
                    <div class="data-box">
                        <div class="box-title"><h2>WEATHER</h2></div>
                        <div class="box-content"></div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
    import HeaderDesktop from '@/components/Elements/HeaderDesktop.vue';
    import DesktopNavbar from '@/components/Elements/DesktopNavbar.vue';
    import { getUserSchedule, getUserSubjectPositions, getUserSubjects } from '@/composables/scheduleQueries';
    import { onMounted, ref } from 'vue';

    onMounted(() => {
        getTime()
        getToday()
        getScheduleData()
        getTodaysPositions()
    })

    const scheduleData = ref()
    const startHour = ref()

    const getScheduleData = async () => {
        scheduleData.value = await getUserSchedule()
        startHour.value = scheduleData.value[0].startHour
    }

    //const currentTime = ref()
    const hours = ref()
    const minutes = ref()
    const progression = ref()

    const getTime = () => {
        const now = new Date();

        hours.value = now.getHours()
        minutes.value = now.getMinutes()
        progression.value = minutes.value / 60 * 100
        console.log("Progression: " + progression.value)

        //currentTime.value = hours + ":" + minutes
    }

    const dayNumber = ref()
    const dayWord = ref()
    const date = ref()


    const getToday = () => {

        const now = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        dayWord.value = days[now.getDay()];
        date.value = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
        dayNumber.value = now.getDay() === 0 ? 7 : now.getDay() - 1;

        console.log(dayWord.value)
        console.log(date.value)
        console.log(dayNumber.value)
    }

    const loading = ref(true)
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

        loading.value = false

        console.log("TODAY'S LECTURES: ")
        console.log(todaysLectures.value)
    }


</script>

<style lang="scss" scoped>
      @import "@/assets/style.scss";
      .dashboard-container{
        width: 100%;
        min-height: 83vh;
        background-color: $dark;
        display: grid;
        grid-template-rows: 49% 49%;
        grid-template-columns: 40% 29% 29%;
        gap: 1%;
        row-gap: 20px;
      }
      .today-schedule{
        grid-row: 1 / span 2;
      }
      .today-schedule, .data-box{
        background-color: $darkest;
      }
      .box-title{
        background-color: $light;
        padding: 0.8rem;
      }
      .box-content{
        padding: 0.8rem;
        color: $white;
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
</style>