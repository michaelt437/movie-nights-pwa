<template>
  <div class="overlay flex justify-center items-center z-20">
    <div class="popup-container w-11/12">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class PopupBase extends Vue {}
</script>
