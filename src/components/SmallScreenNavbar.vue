<template>
  <nav>
    <div class="small-screen-navbar-container">
        <div class="option" @click="toggleMemberViewerModal">
            <font-awesome-icon icon="fa-solid fa-users" class="icon" />
            <h2>Members</h2>
        </div>
        <div class="option" @click="toggleDeleteProjectsModal">
            <font-awesome-icon icon="fa-solid fa-trash" class="icon" />
            <h2>Delete Project</h2>
        </div>
        <div class="option" @click="handleLogout">
            <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="icon" />
            <h2>Logout</h2>
        </div>
    </div> 
    
    <Teleport to="body">
        <DeleteProject @onclosemodal="toggleDeleteProjectsModal" v-if="deleteProjectsModalVisible" />
        <MemberViewer @onclosemodal="toggleMemberViewerModal" @onchangeprojectmetadata="updateProjectTypeAndUserRole" v-if="memberViewerModalVisible" :userRole="userRole" :projectId="projectData.id" />
    </Teleport>
  </nav>

</template>


<script setup>
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'vue-router';
import { defineProps, ref, watch } from "vue"
import { getProjectByID } from '@/composables/useProjects';
import { determineUserRole } from '@/composables/useProjects';
import { determineProjectType } from '@/composables/useProjects';

import DeleteProject from "@/components/Modals/DeleteProject.vue"
import MemberViewer from './Modals/MemberViewer.vue';

const router = useRouter();

const props = defineProps({
  projectId: String
});

// MANAGING MODAL WINDOW FOR DELETING PROJECTS

let deleteProjectsModalVisible = ref(false)
const toggleDeleteProjectsModal = () =>{
  deleteProjectsModalVisible.value = !deleteProjectsModalVisible.value
}

// MANAGING MODAL WINDOW FOR MEMBERS

let memberViewerModalVisible = ref(false)
const toggleMemberViewerModal = () =>{
  memberViewerModalVisible.value = !memberViewerModalVisible.value
}

const projectData = ref(null);
const projectName = ref("");
const projectNameCopy = ref("");
let projectType = ref("")
let userRole = ref("")

watch(() => props.projectId, async (newId) => {
  if (newId) {
    projectData.value = await getProjectByID(newId);
    
    // Update name references
    if (projectData.value?.name) {
      projectName.value = projectData.value.name;
      projectNameCopy.value = projectData.value.name;
    }

    projectType.value = determineProjectType(projectData.value.ownerId, projectData.value.memberIDs)

    userRole.value = determineUserRole(projectData.value.ownerId, projectData.value.memberIDs)

  }
}, { immediate: true });


const updateProjectTypeAndUserRole = async () => {
  
  projectData.value = await getProjectByID(props.projectId);
    
    // Update name references
    if (projectData.value?.name) {
      projectName.value = projectData.value.name;
      projectNameCopy.value = projectData.value.name;
    }

    projectType.value = determineProjectType(projectData.value.ownerId, projectData.value.memberIDs)

    userRole.value = determineUserRole(projectData.value.ownerId, projectData.value.memberIDs)
  
}


const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push('/');
  } catch (error) {
    console.error('Logout error:', error.message);
  }
};
</script>

<style lang="scss" scoped>
    @import "../../src/assets/style.scss";
    .small-screen-navbar-container{
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 5;
        width: 100%;
        border-top-left-radius: 50px;
        border-top-right-radius: 50px;
        background-color: $light;
        color: $white;
        padding: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        .option{
            display: flex;
            flex-direction: column;
            justify-content: center;
            cursor: pointer;
        }
        .icon{
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
        }
        h2{
            font-size: 1.3rem;
            font-weight: normal;
        }
    }

    @media(max-width: 410px){
        .small-screen-navbar-container{
            .icon{
                font-size: 1rem;
                margin-bottom: 0.5rem;
            }
            h2{
                font-size: 1rem;
                font-weight: normal;
            }
        }
    }
</style>