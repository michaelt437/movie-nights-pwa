<template>
  <div class="overlay flex justify-center items-center z-20">
    <div class="popup-container w-11/12">
      <slot @closePopup="close" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class PopupBase extends Vue {}
</script>
<style lang="scss" scoped>
.overlay {
  position: fixed;
  overflow: hidden;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0,0,0,.7);
}
</style>
