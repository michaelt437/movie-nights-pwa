<template>
  <div class="overlay flex justify-center items-center z-20">
    <div class="popup-container w-11/12 md:w-1/4">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class PopupBase extends Vue {}
</script>
<style lang="scss" scoped>
.popup-container {
  @media (max-width: 767px) {
    height: 485px;
    max-height: 485px;
  }
}
</style>
