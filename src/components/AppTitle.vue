<template>
  <!-- Title -->
  <div class="flex items-center text-center justify-center" style="height: 16rem;">
    <h1 class="text-gray-800 uppercase app-title title-styled leading-tight">
      <span class="text-3xl">Movie Nights</span>
      <br>
      <span class="text-5xl font-bold">Roulette</span>
    </h1>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppTitle extends Vue {}
</script>
