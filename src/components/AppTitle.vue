<template>
  <!-- Title -->
  <div
    class="flex items-center text-white md:justify-center"
    :class="{ 'justify-center' : $route.name === 'Home'}"
    :style="containerHeight">
    <span class="app-title">
      <h1 v-if="$route.name === 'Home'" class="uppercase title-styled leading-tight text-center">
        <span class="text-3xl">Movie Nights</span>
        <br>
        <span class="text-5xl font-bold">Roulette</span>
      </h1>
      <h1 v-if="$route.name === 'Movie Pool'" class="text-4xl title-styled text-white font-extrabold uppercase mt-24">Your List</h1>
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppTitle extends Vue {
  get containerHeight (): object {
    return {
      height: this.$route.name === "Home" ? "16rem" : "12rem"
    };
  }
}
</script>
