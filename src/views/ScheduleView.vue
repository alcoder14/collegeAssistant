<template>
    <div class="schedule-container" v-if="!loading">
        <div class="management-row">
            <div class="left-side">
                <h2 class="interface-title" v-if="!editingScheduleName" style="margin-right: 0.5rem;">{{ scheduleName }}</h2>
                <button @click="toggleEditScheduleName" v-if="!editingScheduleName" class="transparent-btn"><font-awesome-icon icon="fa fa-pen" /></button>

                <input type="text" v-model="scheduleName" v-if="editingScheduleName">

                <button v-if="editingScheduleName"><font-awesome-icon icon="fa fa-check" @click="changeScheduleName"/></button>

                <button v-if="editingScheduleName" @click="keepScheduleName"><font-awesome-icon icon="fa fa-times"/></button>
            </div>
            <div class="right-side">
              <label>Starting time: </label>
              <DropdownComponent :selectedOption="selectedStartHourOption" :options="startHourOptions" @onSelected="handleStartHourChange" v-if="schedule.length !== 0" />
            </div>
        </div>
        <div class="schedule">
            <div class="days-row">
                <div class="time-cell">TIME | DAY</div>
                <div class="day-cell">MON</div>
                <div class="day-cell">TUE</div>
                <div class="day-cell">WED</div>
                <div class="day-cell">THU</div>
                <div class="day-cell">FRI</div>
                <div class="day-cell">SAT</div>
                <div class="day-cell">SUN</div>
            </div>
            <div v-for="y in 14" :key="y" class="timetable-row">
                <div class="time-cell">
                  {{ startingTimes[y-1] }}
                </div>
                <div
                    v-for="x in 7"
                    :key="x"
                    class="timetable-cell"
                    :style="{ backgroundColor: getCellColor(x-1, y-1) }"
                    @click="openSelectSubjectModal(x-1, y-1)"
                >
                    {{ getCellText(x-1, y-1) }}
                </div>
            </div>
        </div>
    </div>

    <div class="subjects-container" v-if="!loading">
        <div class="management-row">
            <div class="left-side">
                <h2 class="interface-title">Subjects</h2>
                <button @click="toggleAddSubjectModal"><font-awesome-icon icon="fa fa-plus" /> New</button>
            </div>
            <div class="right-side"></div>
        </div>
        <div class="subjects">
            <div v-for="subject in subjects" :key="subject.id" class="subject" :style="{backgroundColor: subject.color}" >
                <div class="text">
                    <h3> {{ subject.subjectShortName }} </h3>
                    <h4>{{ subject.subjectName }} </h4>
                    <h5> {{ subject.subjectTeacher }} </h5>
                </div>
                <div class="deleteSubjectBtn" @click="deleteSubject(subject.id)">
                    <font-awesome-icon icon="fa fa-trash trash-icon"/>
                </div>
            </div>
        </div>
    </div>

    <div class="schedule-loader" v-if="loading">
      <atom-spinner :animation-duration="1000" :size="100" color="#55DFD4"/>
      <p style="margin-top: 1rem">Loading</p>
    </div>
    

   <SelectSubjectModal :visible="selectSubjectModalVisible" :subjects="subjects" @close="closeSelectSubjectModal" @select-subject="selectSubject" @select-none="selectNone" />
    <AddSubjectModal @closed="toggleAddSubjectModal" @listUpdated="loadSubjects" v-if="addSubjectModalVisible" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserSubjects, getUserSubjectPositions, saveSubjectPosition, deleteSubjectPosition, deleteSubjectAndTheirPositions, getUserSchedule, updateScheduleStartHour, updateScheduleName } from '@/composables/scheduleQueries';

//import HeaderDesktop from '@/components/Elements/HeaderDesktop.vue';
//import DesktopNavbar from '@/components/Elements/DesktopNavbar.vue';
import AddSubjectModal from '@/components/Modals/AddSubjectModal.vue';
import SelectSubjectModal from '@/components/Modals/SelectSubjectModal.vue';
import DropdownComponent from '@/components/Elements/DropdownComponent.vue';
import { AtomSpinner } from 'epic-spinners';


const addSubjectModalVisible = ref(false);
const toggleAddSubjectModal = () => {
    addSubjectModalVisible.value = !addSubjectModalVisible.value;
};

const loading = ref(true)

onMounted(async () => {
  await Promise.all([loadSubjects(), loadSubjectPositions()]);
  compileFilledCells();
  await loadSchedule()
  loading.value = false
});

const schedule = ref([]);
const scheduleData = ref()
const selectedStartHourOption = ref()
const scheduleName = ref([])
const scheduleNameCopy = ref([])
const startHourOptions = ref([{value: "07:00", visibleValue: "07:00"}, {value: "08:00", visibleValue: "08:00"}])
const loadSchedule = async () => {
  schedule.value = await getUserSchedule();
  scheduleData.value = schedule.value[0]
  selectedStartHourOption.value = scheduleData.value.startHour
  scheduleName.value = scheduleData.value.scheduleName
  scheduleNameCopy.value = scheduleName.value
  calculateStartingTimes(selectedStartHourOption.value)
}

const editingScheduleName = ref(false)
const toggleEditScheduleName = () => {
  editingScheduleName.value = !editingScheduleName.value
}

const changeScheduleName = async () => {
  scheduleNameCopy.value = scheduleName.value
  toggleEditScheduleName()
  console.log(scheduleName.value)
  await updateScheduleName(scheduleName.value)
}
const keepScheduleName = () => {
  scheduleName.value = scheduleNameCopy.value
  toggleEditScheduleName()
}

const startingTimes = ref([])

const calculateStartingTimes = (startHour) => {
  
  startingTimes.value = []
  startingTimes.value.push(startHour)

  let startHourInt = parseInt(startHour[1])

  let lastHour;
  if(startHour === "07:00"){
    lastHour = 20;
  } else {
    lastHour = 21;
  }

  for(let i = startHourInt; i < lastHour; i++){
    startHourInt++;
    let startHourString;
    if(startHourInt < 10){
      startHourString = "0" + startHourInt.toString() + ":00"
    } else {
      startHourString = startHourInt.toString() + ":00"
    }
    startingTimes.value.push(startHourString)
  } 

  console.log(startingTimes.value)
}

const handleStartHourChange = async (newStartHour) => {

  calculateStartingTimes(newStartHour)
  await updateScheduleStartHour(newStartHour)

}

/* --- Data loading --- */
const subjects = ref([]);
const loadSubjects = async () => {
  subjects.value = await getUserSubjects();
  console.log(subjects.value);
};

const subjectPositions = ref([]);
const loadSubjectPositions = async () => {
  subjectPositions.value = await getUserSubjectPositions();
  console.log(subjectPositions.value);
};

/* --- Compile combined subject-position info --- */
const filledCells = ref([]);
const compileFilledCells = () => {
  filledCells.value = []; // 
  subjects.value.forEach((subject) => {
    subjectPositions.value.forEach((subjectPosition) => {
      if (subjectPosition.subjectID === subject.id) {
        filledCells.value.push({
          id: subject.id,
          subjectName: subject.subjectName,
          subjectShortName: subject.subjectShortName,
          subjectTeacher: subject.subjectTeacher,
          xPos: subjectPosition.xPosition,
          yPos: subjectPosition.yPosition,
          color: subject.color,
        });
      }
    });
  });

  console.log(filledCells.value);
};

/* --- Helpers to find cell content --- */
const getCell = (x, y) => filledCells.value.find((c) => c.xPos === x && c.yPos === y);
const getCellText = (x, y) => {
  const cell = getCell(x, y);
  return cell ? cell.subjectShortName : '';
};
const getCellColor = (x, y) => {
  const cell = getCell(x, y);
  // Always return a color string — prevents leftover color after removal
  return cell ? cell.color : '#2C2C2C'; // or '#ffffff' if you prefer a light grid
};

/* --- Modal Handling --- */
const selectSubjectModalVisible = ref(false);
const selectedCoords = ref({ x: null, y: null });

const openSelectSubjectModal = (x, y) => {
  console.log('Opening modal for cell', x, y);
  selectedCoords.value = { x, y };
  selectSubjectModalVisible.value = true;
};

const closeSelectSubjectModal = () => {
  selectSubjectModalVisible.value = false;
};

/* --- Subject Selection --- */
const selectSubject = async (subject) => {
  const x = selectedCoords.value.x;
  const y = selectedCoords.value.y;
  const idx = filledCells.value.findIndex((cell) => cell.xPos === x && cell.yPos === y);

  if (idx !== -1) {
    // Replace the existing entry fully so color and other fields update
    filledCells.value[idx] = {
      ...filledCells.value[idx],
      id: subject.id,
      subjectName: subject.subjectName,
      subjectShortName: subject.subjectShortName,
      subjectTeacher: subject.subjectTeacher,
      color: subject.color,
    };
    // Ensure reactivity on array update
    filledCells.value = [...filledCells.value];
  } else {
    // Add new entry
    filledCells.value.push({
      id: subject.id,
      subjectName: subject.subjectName,
      subjectShortName: subject.subjectShortName,
      subjectTeacher: subject.subjectTeacher,
      xPos: x,
      yPos: y,
      color: subject.color,
    });
  }

  closeSelectSubjectModal();

  try {
    await deleteSubjectPosition(x, y) 
    await saveSubjectPosition(subject.id, x, y);
  } catch (error) {
    console.error('Failed to save position:', error);
  }

};

/* --- “None” selection (clear cell) --- */
const selectNone = async () => {
  const x = selectedCoords.value.x;
  const y = selectedCoords.value.y;
  const idx = filledCells.value.findIndex((cell) => cell.xPos === x && cell.yPos === y);

  if (idx !== -1) {
    // Remove cell entry reactively
    filledCells.value.splice(idx, 1);
    filledCells.value = [...filledCells.value]; // ensure re-render
  }

  closeSelectSubjectModal();

  try {
    await deleteSubjectPosition(x, y);
  } catch (error) {
    console.error('Failed to delete subject position:', error);
  }

};

const deleteSubject = async (id) => {
    try {
        subjects.value = subjects.value.filter(s => s.id !== id);
        filledCells.value = filledCells.value.filter(c => c.id !== id);
        await deleteSubjectAndTheirPositions(id)
    } catch (error) {
        console.log(error)
    }
}
</script>


<style lang="scss" scoped>
@import "@/assets/style.scss";
.schedule-loader{
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
.schedule-container{
  width: 100%;
  background-color: $darkest;
  min-height: 55vh;
  margin-bottom: 2rem;
  user-select: none;
}
.subjects-container{
  width: 100%;
  background-color: $darkest;
  min-height: 16vh;
  user-select: none;
  .subjects{
      padding-left: 1rem;
      display: grid;
      grid-template-columns: repeat(8, auto);
      gap: 20px;
      .subject{
          display: flex;
          flex-direction: row;
          .text{
              width: 70%;
              display: flex;
              flex-direction: column;
              padding: 0.3rem;
          }
          .deleteSubjectBtn{
              width: 30%;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              background-color: $dark;
              opacity: 0.5;
              .trash-icon{
                  opacity: 1;
              }
          }
          h3{
              font-size: 1.2rem;
          }
          h4{
              font-size: 0.8rem;
          }
          h5 {
              font-size: 0.7rem;
          }
      }
  }
}



.timetable {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.days-row{
  display: flex;
}
.day-cell{
  width: 12.5%;
  padding: 0.5rem;
  text-align: center;
  background-color: $light;
}
.time-cell{
  width: 12.5%;
  border: 1px solid $dark;
  text-align: center;
  padding: 0.5rem;
  color: $white;

}
.timetable-row {
  display: flex;
}

.timetable-cell {
  cursor: pointer;  
  width: 12.5%;
  height: 35px;
  border: 1px solid $white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-align: center;
  box-sizing: border-box;
}
</style>