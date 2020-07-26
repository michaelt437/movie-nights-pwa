<template>
  <div class="sheet absolute rounded-t-md bg-white z-20">
    <slot />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class DrawerBase extends Vue {}
</script>
<style lang="scss" scoped>
.sheet {
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
