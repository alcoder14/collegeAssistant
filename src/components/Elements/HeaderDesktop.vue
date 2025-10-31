<template>
    <header>
        <h1>COLLEGE ASSISTANT</h1>
        <div class="weather-container" v-if="weather != null">
          <h3 class="weather-data">Temperature: {{ weather.current_weather.temperature }} °C</h3>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const lat = ref(null)
const lon = ref(null)
const weather = ref(null)
const error = ref(null)

const fetchWeather = async (lat_, lon_) => {

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat_}&longitude=${lon_}&current_weather=true`
  try {
    const resp = await fetch(url)
    const data = await resp.json()
    weather.value = data
    console.log(weather.value)
  } catch (err) {
    console.error("Error fetching weather:", err)
    error.value = "Failed to fetch weather"
  }
}

const getLocationAndWeather = () => {
  if (!navigator.geolocation) {
    error.value = "Geolocation not supported"
    return
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      lat.value = pos.coords.latitude
      lon.value = pos.coords.longitude
      fetchWeather(lat.value, lon.value)
    },
    err => {
      console.error("Geolocation error:", err)
      error.value = `Geolocation error: ${err.message}`
    }
  )
}

onMounted(() => {
  getLocationAndWeather()
})
</script>

  <style lang="scss" scoped>
      @import "@/assets/style.scss";
      header{
        width: 100%;
        height: 10vh;
        background-color: $darkest;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 2rem;
        padding-right: 2rem;
        border-bottom: 2px solid #565656;
      }
      h1{
        color: $white;
        font-weight: bold;
        font-size: 2rem;
      }
      .weather-data{
        color: $white;
        font-weight: lighter;
        font-size: 1.1rem;
      }
  </style>