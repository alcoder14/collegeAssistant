<template>
    <HeaderDesktop />
    <div class="flex-container">
        <DesktopNavbar :selected="'ExamsView'" />

        <main class="view-blank">
            <div class="view-container">

                <div class="exam-interface">
                    <div class="management-row">
                        <div class="left-side">
                            <h2 class="container-title">Exams</h2>
                            <button @click="toggleExamModal"><font-awesome-icon icon="fa fa-plus" /> New</button>
                        </div>
                        <div class="right-side">
                            <DropdownComponent :options="typeOptions" :selected-option="selectedType" @closed="toggleExamModal"/>
                        </div>
                    </div>
                </div>
        
            </div>
        </main>

    </div>

    <ExamModal @closed="toggleExamModal" v-if="examModalVisible" />
</template>

<script setup>
    import HeaderDesktop from '@/components/Elements/HeaderDesktop.vue';
    import DesktopNavbar from '@/components/Elements/DesktopNavbar.vue';
    import DropdownComponent from '@/components/Elements/DropdownComponent.vue';
    import ExamModal from '@/components/Modals/ExamModal.vue';
    import { ref } from "vue"

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
    
</script>

<style lang="scss" scoped>
      @import "@/assets/style.scss";

      .exam-interface{
        background-color: $darkest;
        min-height: 80vh;
      }
</style>