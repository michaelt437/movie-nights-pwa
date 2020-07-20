<template>
  <div class="movie-card rounded-lg bg-indigo-600 text-gray-200 px-5 pt-6 pb-3 mb-4 border border-yellow-500 relative">
    <div class="absolute text-black btn btn-yellow-500 capitalize whitespace-no-wrap pointer-events-none" style="top: -20px; right: 50%; transform: translateX(50%);">
      <i class="fas fa-star text-white text-sm mr-3"></i>
      {{ movie.user }}'s Pick
      <i class="fas fa-star text-white text-sm ml-3"></i>
    </div>
    <div class="movie-card__title text-2xl capitalize">{{ movie.title }}</div>
    <div class="movie-card__service text-md my-2" :class="movie.service.value">{{ movie.service.title }}</div>
    <div class="movie-card__footer flex justify-between">
      <div class="movie-card__duration text-sm">{{ movie.duration }} minutes</div>
      <div class="movie-card__watch-date text-sm">{{ $moment(movie.watchDate).format("M.D.YYYY") }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IMovie from "@/interface/IMovie";
@Component
export default class CardTonightsPick extends Vue {
  get movie (): IMovie {
    return this.$store.getters.getTonightsPick;
  }
}
</script>
