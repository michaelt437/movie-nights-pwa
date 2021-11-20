<template>
  <div class="flex flex-col rounded-lg bg-gray-200 text-gray-600 px-5 mb-4">
    <p class="text-2xl text-center py-5">Edit Watch Provider</p>
    <div class="popup-content overflow-y-auto">
      <!-- home video option? -->
      <div class="tabs mb-5">
        <div
          class="tab"
          :class="{
            active: selectedProviderSource === WatchProviderSource.JustWatch,
          }"
          @click="selectedProviderSource = WatchProviderSource.JustWatch"
        >
          Streaming
        </div>
        <div
          class="tab"
          :class="{
            active: selectedProviderSource === WatchProviderSource.Manual,
          }"
          @click="selectedProviderSource = WatchProviderSource.Manual"
        >
          Custom
        </div>
      </div>
      <template v-if="selectedProviderSource === WatchProviderSource.JustWatch">
        <template v-if="movie.providers.length">
          <div class="select">
            <select v-model="selectedProvider">
              <option
                v-for="provider in movie.providers"
                :key="provider.provider_id"
                :value="provider"
              >
                {{ provider.provider_name }}
              </option>
            </select>
            <i class="fas fa-caret-down absolute top-5 right-5" />
          </div>
        </template>
      </template>
      <template v-else>
        <div class="input">
          <input
            type="text"
            placeholder="Where can you watch this movie?"
            v-model="customProvider.provider_name"
          />
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
        @click="!disableButton && submitEdits"
      >
        <i class="fas fa-check mr-1"></i> Save
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
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
  customProvider: Partial<TMDBStreamProvider> = {
    provider_id: 10000,
    provider_name: "",
  };

  get disableButton(): boolean {
    if (this.selectedProviderSource === WatchProviderSource.JustWatch)
      return isEqual(this.selectedProvider, this.movie.providers[0]);
    else return this.customProvider.provider_name?.trim() === "";
  }

  get movieToEditOmitId(): IMovie {
    return omit(this.movieToEdit, "documentId");
  }

  @Watch("selectedProviderSource")
  clearCustomProviderName(): void {
    this.customProvider.provider_name = "";
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
