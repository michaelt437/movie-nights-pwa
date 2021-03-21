<template>
  <div class="movie-card rounded-lg bg-gray-800 text-gray-200 px-5 py-3 mb-4">
    <div class="movie-card__title flex items-center text-2xl capitalize">
      {{ movie.title }}
      <i v-show="isRewatch" class="fas fa-sync text-green-300 ml-auto" title="Rewatch"></i>
    </div>
    <div class="movie-card__service text-md my-2" :class="movie.service.value">{{ movie.service.title }}</div>
    <div class="movie-card__footer flex justify-between">
      <div class="movie-card__duration text-sm">{{ formatDuration(movie.duration) }}</div>
      <div class="movie-card__watch-date text-sm">{{ $moment(movie.watchDate).format("M.D.YYYY") }}</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import IMovie from "@/interface/IMovie";

@Component
export default class CardMovie extends Vue {
  @Prop(Object) readonly movie!: IMovie;

  get isRewatch (): boolean {
    return Boolean(this.$store.getters.getMoviesWatched.find((paramMovie: IMovie) => {
      return paramMovie.title.toLowerCase() === this.movie.title.toLowerCase() &&
      paramMovie.watchDate! < this.movie.watchDate!;
    }));
  }

  formatDuration (duration: string | number): string {
    const _duration: number = (typeof duration === "string") ? parseInt(duration) : duration;
    return `${Math.floor(_duration / 60)}hr ${_duration % 60}m`;
  }
}
</script>
