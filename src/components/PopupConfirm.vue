<template>
  <div class="rounded-lg bg-indigo-600 text-gray-200 px-5 py-3 mb-4">
    <p class="text-lg"><strong>Delete <span class="italic capitalize">{{ movie.title }}</span></strong></p>
    <p class="mt-3 mb-10">Are you sure you want to continue?</p>
    <div class="btn-group justify-end">
      <button class="btn btn-white outline" @click="closePopup">
        <i class="fas fa-times mr-1"></i> Cancel
      </button>
      <button class="btn btn-teal-400" @click="handleAction">
        <i class="fas fa-check mr-1"></i> Confirm
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import IMovie from "@/interface/IMovie";
@Component
export default class PopupConfirm extends Vue {
  @Prop() readonly movie?: IMovie;
  @Prop(String) readonly message?: string;
  @Prop() readonly action?: Function;

  handleAction (): void {
    this.action!();
    this.closePopup();
  }

  closePopup (): void {
    this.$emit("closePopup");
  }
}
</script>
