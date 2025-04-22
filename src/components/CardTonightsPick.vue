<template>
  <div
    class="movie-card rounded-lg bg-indigo-600 text-gray-200 px-5 pt-6 pb-3 mb-4 border border-yellow-500 relative"
    @click="showDetails = !showDetails"
  >
    <div
      class="absolute text-black btn btn-yellow-500 capitalize whitespace-nowrap pointer-events-none"
      style="top: -20px; right: 50%; transform: translateX(50%)"
    >
      <i class="fas fa-star text-white text-sm mr-3"></i>
      {{ movie.user }}'s Pick
      <i class="fas fa-star text-white text-sm ml-3"></i>
    </div>
    <div
      class="movie-card__title text-2xl flex items-center justify-between capitalize"
    >
      {{ movie.title }}
      <span class="ml-auto space-x-3">
        <i
          v-show="isRewatch"
          class="fas fa-sync text-green-300"
          title="Rewatch"
        ></i>
        <i
          class="far fa-times-circle text-red-500 cursor-pointer text-3xl"
          title="Undo"
          @click.stop="undoPrompt()"
        ></i>
      </span>
    </div>
    <div class="movie-card__duration text-sm my-4">
      {{ formatDuration(movie.runtime) }}
    </div>
    <div v-if="showDetails" class="movie-card__genres text-sm w-full">
      <template v-for="genre in movie.genres">
        <span
          :key="genre.id"
          class="border border-gray-500 mr-1 px-2 rounded-sm"
        >
          {{ genre.name }}
        </span>
      </template>
    </div>
    <div v-show="showDetails" class="flex flex-col gap-y-6 my-6">
      <div class="movie-card__desc">
        <p class="mb-0 font-semibold">Overview</p>
        {{ movie.overview }}
      </div>
      <div class="movie-card__year">
        <p class="mb-0 font-semibold">Release Year</p>
        {{ $moment(movie.release_date).format("YYYY") }}
      </div>
      <div class="movie-card__crew">
        <p class="mb-0 font-semibold">Director</p>
        {{ directorCredit }}
      </div>
    </div>
    <div class="movie-card__footer flex justify-between items-center">
      <div
        class="movie-card__service flex items-center text-md"
        :class="movie.providers ? '' : movie.service.value"
      >
        <img
          v-if="!movie.customProvider && movie.providers"
          :src="providerLogo"
          title="provider"
          class="rounded-full w-5 h-5 mr-2"
        />
        <template v-if="movie.providers">
          {{ displayProviderText }}
        </template>
        <template v-else>
          {{ movie.service.title }}
        </template>
      </div>
      <div class="movie-card__watch-date text-sm">
        {{ $moment(movie.watchDate).format("M.D.YYYY") }}
      </div>
    </div>
    <div class="movie-card__actions text-center px-5 pt-2">
      <i
        class="fas text-md"
        :class="showDetails ? `fa-caret-up` : `fa-caret-down`"
      ></i>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/db";
import IMovie from "@/types/interface/IMovie";
import { TMDBConfig } from "@/types/tmdb";

@Component
export default class CardTonightsPick extends Vue {
  showDetails = false;

  get isSignedIn (): boolean {
    return this.$store.state.signedIn;
  }

  get movie (): IMovie {
    return this.$store.getters.getTonightsPick;
  }

  get isRewatch (): boolean {
    return Boolean(
      this.$store.getters.getMoviesWatched.find((paramMovie: IMovie) => {
        if (paramMovie.service) {
          return (
            paramMovie.title.toLowerCase() === this.movie.title.toLowerCase() &&
            paramMovie.hasWatched
          );
        }
        if (paramMovie.id) {
          return paramMovie.id === this.movie.id && paramMovie.hasWatched;
        }
      })
    );
  }

  get tmdbConfig (): TMDBConfig {
    return this.$store.state.config;
  }

  get providerLogo (): string | undefined {
    if (this.movie.providers) {
      return `${this.tmdbConfig.images.secure_base_url}${this.tmdbConfig.images.logo_sizes[0]}${this.movie.providers[0].logo_path}`;
    } else {
      return undefined;
    }
  }

  get displayProviderText (): string {
    if (this.movie.customProvider) {
      return this.movie.customProviderModel!.provider_name!;
    }
    return this.movie.providers[0].provider_name;
  }

  get directorCredit (): string | undefined {
    return this.movie.credits.crew.find((member) => member.job === "Director")
      ?.name;
  }

  formatDuration (duration: string | number): string {
    const _duration: number =
      typeof duration === "string" ? parseInt(duration) : duration;
    return `${Math.floor(_duration / 60)}hr ${_duration % 60}m`;
  }

  undoPrompt (): void {
    this.$emit(
      "popup",
      "PopupConfirm",
      "Undo",
      this.movie,
      "Are you sure you want to undo your pick?",
      this.undoSelection,
      `${this.movie.title.toUpperCase()} has been added back to your list.`
    );
  }

  async undoSelection (): Promise<void> {
    if (this.isSignedIn) {
      await deleteDoc(doc(db, "tonightsPick", "movie"));
      await updateDoc(
        doc(
          db,
          this.$store.getters.getCurrentUserDocumentId,
          this.movie.documentId as string
        ),
        {
          hasWatched: false
        }
      );

      this.$store.commit("setTonightsPick", null);
      this.$store.commit("updateRollPermission", true);
    }
  }
}
</script>
