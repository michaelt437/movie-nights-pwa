<template>
  <div class="flex flex-col rounded-lg bg-gray-200 text-gray-600 px-5 mb-4">
    <p class="text-2xl text-center py-5">Edit Details</p>
    <div class="popup-content overflow-y-auto">
      <!-- home video option? -->
      <template v-if="movie.providers.length">
        <div class="select">
          <label for="providers">Edit Primary Provider</label>
          <select id="providers" class="text-sm" v-model="selectedProvider">
            <option
              v-for="provider in movie.providers"
              :key="provider.provider_id"
              :value="provider"
            >
              {{ provider.provider_name }}
            </option>
          </select>
          <i class="fas fa-caret-down absolute top-10 right-5" />
        </div>
      </template>
    </div>
    <div class="btn-group flex py-5">
      <span class="ml-auto"></span>
      <button
        class="btn btn-gray-400 outline"
        style="flex-basis: 30%"
        @click="closePopup"
      >
        <i class="fas fa-times mr-1"></i> Cancel
      </button>
      <button
        :class="{ disabled: disableButton }"
        class="btn btn-green-400 text-white"
        style="flex-basis: 30%"
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
import { db } from "@/db";
import { omit, isEqual } from "lodash";
import { TMDBStreamProvider } from "@/types/tmdb";

@Component
export default class PopupEditMovie extends Vue {
  @Prop(Object) readonly movie!: IMovie;
  @Prop() readonly action?: Function;

  movieToEdit: IMovie = {} as IMovie;
  selectedProvider: TMDBStreamProvider = {} as TMDBStreamProvider;

  get disableButton (): boolean {
    return isEqual(this.movie, this.movieToEdit);
  }

  get movieToEditOmitId (): IMovie {
    return omit(this.movieToEdit, "documentId");
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
    if (this.movieToEdit.providers.length) {
      this.selectedProvider = this.movieToEdit.providers[0];
    }
  }
}
</script>
