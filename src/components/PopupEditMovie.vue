<template>
  <div
    class="flex flex-col rounded-lg bg-indigo-600 text-gray-200 px-5 mb-4 h-full"
  >
    <p class="text-2xl text-center py-5">Edit Details</p>
    <div class="popup-content overflow-y-auto">
      <!-- home video option? -->
    </div>
    <div class="btn-group flex py-3">
      <span class="ml-auto"></span>
      <button
        class="btn btn-gray-400 outline"
        style="flex-basis: 30%;"
        @click="closePopup"
      >
        <i class="fas fa-times mr-1"></i> Cancel
      </button>
      <button
        :class="{ disabled: disableButton }"
        class="btn btn-green-400"
        style="flex-basis: 30%;"
        @click="submitEdits"
      >
        <i class="fas fa-check mr-1"></i> Save
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import IMovie from "@/types/interface/IMovie";
import IGenre from "@/types/interface/IGenre";
import { db } from "@/db";
import { omit, isEqual } from "lodash";

@Component
export default class PopupEditMovie extends Vue {
  @Prop(Object) readonly movie!: IMovie;
  @Prop() readonly action?: Function;

  movieToEdit: IMovie = {
    documentId: "",
    title: "",
    service: {
      title: "",
      value: ""
    },
    duration: 0,
    genres: []
  };

  get disableButton (): boolean {
    return isEqual(this.movie, this.movieToEdit);
  }

  get movieToEditOmitId (): IMovie {
    return omit(this.movieToEdit, "documentId");
  }

  hasGenre (genre: string): object {
    return {
      active: this.movieToEdit.genres.find(
        (genreObj: IGenre) => genreObj.value === genre
      )
    };
  }

  closePopup (): void {
    this.action!();
    this.$emit("closePopup");
  }

  submitEdits (): void {
    db.collection(this.$store.getters.getCurrentUserDocumentId)
      .doc(this.movie.documentId)
      .update(this.movieToEditOmitId);
    this.$store.commit("submitEditsToMovie", this.movieToEdit);
    this.action!();
    this.closePopup();
  }

  mounted () {
    this.movieToEdit = JSON.parse(JSON.stringify(this.movie));
  }
}
</script>
