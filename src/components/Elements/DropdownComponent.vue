<template>
    <select id="status" class="dropdown" :value="props.selectedOption" @change="handleSelection" >
        <option v-for="option in options" :key="option.value" :value="option.value">{{ option.visibleValue }}</option>
    </select>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, onMounted } from 'vue'
  
  // Props
  const props = defineProps({
    options: Array,
    selectedOption: String
  })

  onMounted(() => {
    console.log(props.options)
    console.log("Selected option DROPDOWN: " + props.selectedOption)
  })
  
  const emit = defineEmits(['onSelected'])

  const handleSelection = (event) =>{
    try {
      emit("onSelected", event.target.value);
      console.log(event.target.value)
      console.log("emitted succesfully")
    } catch (error) {
      console.error("Emit failed:", error);
    }
  }

  </script>
  

<style lang="scss" scoped>
    @import "@/assets/style.scss";
    .dropdown{
      font-size: 1rem;
      padding: 6px 10px;
      background-color: $dark;
      color: $white;
      border-radius: 20px;
      border: solid 2px $grey;
      &:after {
          content: '\25BC'; /* Unicode character for a downward-pointing triangle */
          position: absolute;
          top: 50%;
          right: 10px; /* Adjust the right position as needed */
          transform: translateY(-50%);
          color: #ff0000; /* Change the color of the arrow icon */
      }
      .option{
          padding: 10px;
      }
  }
  @media(max-height: 1000px){
    .dropdown{
        font-size: 16px;
        padding: 5px 8px;
    }
  }
</style>