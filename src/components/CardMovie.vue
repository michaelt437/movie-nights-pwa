<template>
  <div class="movie-card rounded-lg bg-gray-800 text-gray-200 px-5 py-3 mb-4">
    <div class="movie-card__title text-2xl capitalize">{{ movie.title }}</div>
    <div class="movie-card__service text-md my-2" :class="movie.service.value">{{ movie.service.title }}</div>
    <div class="movie-card__footer flex justify-between">
      <div class="movie-card__duration text-sm">{{ movie.duration }} minutes</div>
      <!-- <div class="movie-card__watch-date text-sm">{{ movie.watchDate }}</div> -->
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import IMovie from "@/interface/IMovie";

@Component
export default class CardMovie extends Vue {
  @Prop(Object) readonly movie!: IMovie;
}
</script>
