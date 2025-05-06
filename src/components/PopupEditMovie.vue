<template>
  <div class="flex flex-col rounded-lg bg-gray-200 text-gray-600 px-5 mb-4">
    <p class="text-2xl text-center py-5">{{ movie.title }}</p>
    <div class="popup-content overflow-y-auto">
      <div class="tabs mb-5">
        <div
          class="tab"
          :class="{
            active: movieToEdit.customProvider === WatchProviderSource.JustWatch
          }"
          @click="setProviderSource(WatchProviderSource.JustWatch)"
        >
          Streaming
        </div>
        <div
          class="tab"
          :class="{
            active: movieToEdit.customProvider === WatchProviderSource.Manual
          }"
          @click="setProviderSource(WatchProviderSource.Manual)"
        >
          Custom
        </div>
      </div>
      <div
        v-if="movieToEdit.customProvider === WatchProviderSource.JustWatch"
        class="flex items-center mb-2"
      >
        <template v-if="movieToEdit.providers.length">
          <div class="select flex-grow">
            <select
              v-model="selectedProvider"
              style="margin-bottom: 0 !important"
            >
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
        <template v-else>
          <div
            class="rounded-lg border border-dashed border-gray-400 p-2 flex-grow"
          >
            No providers available
          </div>
        </template>
        <button
          class="btn btn-indigo-400 text-white ml-2"
          @click="refreshProviders"
        >
          Refresh
        </button>
      </div>
      <template v-else>
        <div class="select">
          <select
            id="movie-provider"
            name="movie-provider"
            v-model="movieToEdit.customProviderModel"
          >
            <option
              v-for="custProvider in customProvidersList"
              :key="custProvider.provider_id"
              :value="custProvider"
            >
              {{ custProvider.provider_name }}
            </option>
          </select>
          <i class="fas fa-caret-down absolute top-5 right-5" />
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
        @click="!disableButton && submitEdits()"
      >
        <i class="fas fa-check mr-1"></i> Save
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { doc, updateDoc } from "@firebase/firestore";
import IMovie from "@/types/interface/IMovie";
import { db } from "@/db";
import { omit, isEqual } from "lodash";
import { TMDBStreamProvider } from "@/types/tmdb";
import { WatchProviderSource } from "@/types/enums";

@Component
export default class PopupEditMovie extends Vue {
  @Prop(Object) readonly movie!: IMovie;

  movieToEdit: IMovie = {} as IMovie;
  WatchProviderSource: typeof WatchProviderSource = WatchProviderSource;
  selectedProvider: TMDBStreamProvider = {} as TMDBStreamProvider;
  selectedCustomProvider: Partial<TMDBStreamProvider> = {
    provider_id: 10000,
    provider_name: "DVD/Bluray"
  };

  customProvidersList: Partial<TMDBStreamProvider>[] = [
    {
      provider_id: 10000,
      provider_name: "DVD/Bluray"
    },
    {
      provider_id: 10001,
      provider_name: "Online - Youtube"
    }
  ];

  get selectedProviderSource (): WatchProviderSource {
    return this.movieToEdit.customProvider!;
  }

  set selectedProviderSource (val: WatchProviderSource) {
    this.movieToEdit.customProvider = val;
  }

  get disableButton (): boolean {
    if (this.selectedProviderSource === WatchProviderSource.JustWatch) {
      return (
        (this.selectedProviderSource === this.movie.customProvider &&
          isEqual(this.selectedProvider, this.movie.providers[0])) ||
        isEqual(this.selectedProvider, {})
      );
    } else {
      return (
        Boolean(this.movie.customProvider) &&
        isEqual(
          this.movieToEdit.customProviderModel,
          this.movie.customProviderModel
        )
      );
    }
  }

  get movieToEditOmitId (): IMovie {
    return omit(this.movieToEdit, "documentId");
  }

  get isSignedIn (): boolean {
    return this.$store.state.signedIn;
  }

  closePopup (): void {
    this.$emit("closePopup");
  }

  setProviderSource (value: WatchProviderSource): void {
    Vue.set(this.movieToEdit, "customProvider", value);
  }

  unshiftSelectedProvider (): void {
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

  submitEdits (): void {
    if (this.selectedProviderSource === WatchProviderSource.JustWatch) {
      this.unshiftSelectedProvider();
    }

    if (this.isSignedIn) {
      updateDoc(
        doc(
          db,
          this.$store.getters.getCurrentUserDocumentId,
          this.movie.documentId as string
        ),
        this.movieToEditOmitId
      );
    }

    this.$store.commit("submitEditsToMovie", this.movieToEdit);
    this.closePopup();
  }

  async refreshProviders (): Promise<void> {
    const _providers = await this.$store.dispatch("fetchWatchProviders", {
      movieId: this.movie.id
    });
    if (!isEqual(this.movie.providers, _providers)) {
      this.$store.commit("updateProviders", {
        documentId: this.movie.documentId,
        newProviders: _providers
      });
      if (_providers.length) this.selectedProvider = this.movie.providers[0];
      else this.selectedProvider = {} as TMDBStreamProvider;
    }
  }

  created () {
    this.movieToEdit = JSON.parse(JSON.stringify(this.movie));
  }

  mounted () {
    if (this.movieToEdit.providers.length) {
      this.selectedProvider = this.movieToEdit.providers[0];
    }
  }
}
</script>
