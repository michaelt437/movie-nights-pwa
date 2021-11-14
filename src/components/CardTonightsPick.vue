<template>
  <div
    class="
      movie-card
      rounded-lg
      bg-indigo-600
      text-gray-200
      px-5
      pt-6
      pb-3
      mb-4
      border border-yellow-500
      relative
    "
  >
    <div
      class="
        absolute
        text-black
        btn btn-yellow-500
        capitalize
        whitespace-nowrap
        pointer-events-none
      "
      style="top: -20px; right: 50%; transform: translateX(50%)"
    >
      <i class="fas fa-star text-white text-sm mr-3"></i>
      {{ movie.user }}'s Pick
      <i class="fas fa-star text-white text-sm ml-3"></i>
    </div>
    <div
      class="
        movie-card__title
        text-2xl
        flex
        items-center
        justify-between
        capitalize
      "
    >
      {{ movie.title }}
      <i
        v-show="isRewatch"
        class="fas fa-sync text-green-300 ml-auto"
        title="Rewatch"
      ></i>
    </div>
    <div
      class="movie-card__service flex items-center text-md my-2"
      :class="movie.providers ? '' : movie.service.value"
    >
      <img
        v-if="movie.providers"
        :src="providerLogo"
        title="provider"
        class="rounded-full w-5 h-5 mr-2"
      />
      <template v-if="movie.providers">
        {{ movie.providers[0].provider_name }}
      </template>
      <template v-else>
        {{ movie.service.title }}
      </template>
    </div>
    <div class="movie-card__footer flex justify-between">
      <div class="movie-card__duration text-sm">
        {{ formatDuration(movie.runtime) }}
      </div>
      <div class="movie-card__watch-date text-sm">
        {{ $moment(movie.watchDate).format("M.D.YYYY") }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IMovie from "@/types/interface/IMovie";
import { TMDBConfig } from "@/types/tmdb";

@Component
export default class CardTonightsPick extends Vue {
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

  formatDuration (duration: string | number): string {
    const _duration: number =
      typeof duration === "string" ? parseInt(duration) : duration;
    return `${Math.floor(_duration / 60)}hr ${_duration % 60}m`;
  }
}
</script>
