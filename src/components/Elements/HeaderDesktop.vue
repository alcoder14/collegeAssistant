<template>
    <header>
      <div class="logo-container">
        <img src="@/assets/CollegeAssistantLogo.png">
        <h1>COLLEGE ASSISTANT</h1>
      </div>
      <div class="weather-container" v-if="weather != null && !visibleBars">
        <h3 class="weather-data">Temperature: {{ weather.current_weather.temperature }} °C</h3>
      </div>
      <div class="logout-container">
        <button class="logout-btn" @click="handleLogout"><font-awesome-icon icon="fa fa-right-from-bracket" /></button>
      </div>
      <font-awesome-icon icon="fa fa-bars" class="bars toggle-btn" v-if="visibleBars && !visibleMobileNavbar" @click="toggleMobileNavbar" />
      <font-awesome-icon icon="fa fa-xmark" class="xmark toggle-btn" @click="toggleMobileNavbar" v-if="visibleBars && visibleMobileNavbar" />
    </header>

    <div class="mobile-navbar" v-if="visibleMobileNavbar">
      <router-link to="/dashboard" class="link" @click="toggleMobileNavbar">Dashboard</router-link>
      <router-link to="/schedule" class="link" @click="toggleMobileNavbar">Schedule</router-link>
      <router-link to="/tests" class="link" @click="toggleMobileNavbar">Tests</router-link>
      <router-link to="/assignments" class="link" @click="toggleMobileNavbar">Assignments</router-link>
      <router-link to="/notes" class="link" @click="toggleMobileNavbar">Notes</router-link>
    </div>
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


let visibleBars = ref(null)
const visibleMobileNavbar = ref(false)

  const checkWidth = () => {
    if(window.innerWidth > 1650){
      visibleBars.value = false
      visibleMobileNavbar.value = false
    } else {
      visibleBars.value = true
    }
  }

  const toggleMobileNavbar = () => {
    visibleMobileNavbar.value = !visibleMobileNavbar.value
  }

  onMounted(() => {
    checkWidth()
    window.addEventListener("resize", checkWidth)

    getLocationAndWeather()
  })

</script>

  <style lang="scss" scoped>
      @import "@/assets/style.scss";
      .mobile-navbar{
        z-index: 50;
        position: fixed;
        left: 0;
        top: 0;
        width: 50%;
        height: 100vh;
        background-color: $dark;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        font-size: 1.6rem;
        color: $white;
        padding: 1rem;
        .link, .toggle-btn{
          color: $white;
          text-decoration: none;
          margin-bottom: 0.6rem;
        }
        .toggle-btn{
          cursor: pointer;
        }
      }
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
        font-weight: lighter;
        font-size: 2rem;
      }
      .weather-data{
        color: $white;
        font-weight: lighter;
        font-size: 1.1rem;
      }
      .logo-container{
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      img{
        height: 5vh;
        width: 5vh;
        margin-right: 1rem;
      }
      .bars, .xmark{
        font-size: 2rem;
        color: $white;
        cursor: pointer;
      }
      .logout-container{
          width: inherit;
          position: fixed;
          bottom: 0;
          left: 0;
          padding: 1rem;
          display: flex;
          justify-content: end;
        }

        .logout-btn{
        background-color: transparent;
        color: $light;
        font-size: 2rem;
      }
      .logout-btn:hover{
        background-color: $dark;
      }

      @media(max-width: 1000px){
        header{
          height: 7vh;
        }
        img{
          height: 3vh;
          width: 3vh;
        }
        h1, .bars{
          font-size: 1.5rem;
        }
      }
  </style>