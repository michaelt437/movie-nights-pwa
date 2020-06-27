<template>
  <!-- Title -->
  <div
    class="flex items-center text-white"
    :class="{ 'justify-center' : $route.name === 'Home'}"
    style="height: 16rem;">
    <span class="app-title">
      <h1 v-if="$route.name === 'Home'" class="uppercase title-styled leading-tight text-center">
        <span class="text-3xl">Movie Nights</span>
        <br>
        <span class="text-5xl font-bold">Roulette</span>
      </h1>
      <h1 v-if="$route.name === 'Movie Pool'" class="text-4xl text-white font-extrabold uppercase mt-24">Your List</h1>
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppTitle extends Vue {}
</script>
