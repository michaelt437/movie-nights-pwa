<template>
  <div class="movie-card rounded-lg bg-gray-800 text-gray-200 px-5 py-3 mb-4">
    <div class="movie-card__title flex items-center text-2xl capitalize">
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
        {{ formatDuration(movie.duration || movie.runtime) }}
      </div>
      <div class="movie-card__watch-date text-sm">
        {{ $moment(movie.watchDate).format("M.D.YYYY") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import IMovie from "@/types/interface/IMovie";
import { TMDBConfig } from "@/types/tmdb";

@Component
export default class CardMovie extends Vue {
  @Prop(Object) readonly movie!: IMovie;

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
