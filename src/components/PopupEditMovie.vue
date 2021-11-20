<template>
  <div class="flex flex-col rounded-lg bg-gray-200 text-gray-600 px-5 mb-4">
    <p class="text-2xl text-center py-5">Edit Watch Provider</p>
    <div class="popup-content overflow-y-auto">
      <!-- home video option? -->
      <!--     <div
        class="rounded-lg px-3 py-8 bg-indigo-100 border border-indigo-300 mb-3"
      >
        <template v-if="movie.providers.length">
          <label for="autoProvider" class="mb-2">JustWatch Providers</label>
          <div class="select">
            <select
              id="autoProvider"
              class="text-sm relative"
              v-model="selectedProvider"
            >
              <option
                v-for="provider in movie.providers"
                :key="provider.provider_id"
                :value="provider"
              >
                {{ provider.provider_name }}
              </option>
            </select>
            <i class="fas fa-caret-down absolute top-4 right-5" />
          </div>
        </template>
      </div>
      <div class="rounded-lg p-3 border border-gray-300 mb-3">
        <label for="manualProvider" class="mb-2">Manual</label>
        <div class="input">
          <input
            type="text"
            id="manualProvider"
            name="manualProvider"
            placeholder="stuff`"
          />
        </div>
      </div> -->
      <label
        for="justWatchRadio"
        class="block rounded-lg px-3 py-5 mb-3 border border-gray-300"
        :class="{
          'bg-indigo-100 border-indigo-300':
            selectedProviderSource === WatchProviderSource.JustWatch,
        }"
      >
        <input
          id="justWatchRadio"
          type="radio"
          name="watchprovider"
          hidden
          :value="WatchProviderSource.JustWatch"
          v-model="selectedProviderSource"
        />
        JustWatch Providers
      </label>
      <label
        for="manualProvider"
        class="flex rounded-lg px-3 py-3 mb-3 border border-gray-300"
        :class="{
          'bg-indigo-100 border-indigo-300':
            selectedProviderSource === WatchProviderSource.Manual,
        }"
      >
        <input
          id="manualProvider"
          type="radio"
          hidden
          :value="WatchProviderSource.Manual"
          v-model="selectedProviderSource"
        />Manual
        <div class="input">
          <input type="text" placeholder="..." />
        </div>
      </label>
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
import { WatchProviderSource } from "@/types/enums";

@Component
export default class PopupEditMovie extends Vue {
  @Prop(Object) readonly movie!: IMovie;
  @Prop() readonly action?: Function;

  movieToEdit: IMovie = {} as IMovie;
  WatchProviderSource: typeof WatchProviderSource = WatchProviderSource;
  selectedProviderSource: WatchProviderSource = WatchProviderSource.JustWatch;
  selectedProvider: TMDBStreamProvider = {} as TMDBStreamProvider;

  get disableButton(): boolean {
    return isEqual(this.selectedProvider, this.movie.providers[0]);
  }

  get movieToEditOmitId(): IMovie {
    return omit(this.movieToEdit, "documentId");
  }

  closePopup(): void {
    this.action!();
    this.$emit("closePopup");
  }

  unshiftSelectedProvider(): void {
    this.movieToEdit.providers.unshift(
      this.movieToEdit.providers.splice(
        this.movieToEdit.providers.findIndex(
          (provider) =>
            provider.provider_id === this.selectedProvider.provider_id
        ),
        1
      )[0]
    );
  }

  submitEdits(): void {
    this.unshiftSelectedProvider();
    db.collection(this.$store.getters.getCurrentUserDocumentId)
      .doc(this.movie.documentId)
      .update(this.movieToEditOmitId);
    this.$store.commit("submitEditsToMovie", this.movieToEdit);
    this.action!();
    this.closePopup();
  }

  mounted() {
    this.movieToEdit = JSON.parse(JSON.stringify(this.movie));
    if (this.movieToEdit.providers.length) {
      this.selectedProvider = this.movieToEdit.providers[0];
    }
  }
}
</script>
