<template>
  <div class="overlay z-20 md:flex md:justify-center">
    <div
      class="sheet fixed rounded-t-md bg-white z-30 top-0 bottom-0 overflow-auto"
    >
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class DrawerBase extends Vue {}
</script>
<style lang="scss" scoped>
.sheet {
  bottom: 0;
  @media (max-width: 767px) {
    right: 0;
    left: 0;
  }
}
</style>
