<template>
  <div class="fixed left-0 h-64" style="z-index: -1;" :style="paralaxValue">
    <img class="hero inline" src="../assets/hero.jpg" alt="">
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppTitleParalax extends Vue {
  private paralaxOffset = 0;

  get paralaxValue () {
    return {
      top: `-${this.paralaxOffset * 0.5}px`
    };
  }

  created () {
    window.addEventListener("scroll", (): void => {
      // paralax calc
      const scrolled = window.pageYOffset;
      this.paralaxOffset = scrolled;
    });
  }
}
</script>
