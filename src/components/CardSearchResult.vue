<template>
  <div class="movie-card rounded-lg bg-white text-gray-600 px-5 py-3 mb-4">
    <div class="movie-card__title flex items-center font-bold text-lg capitalize">
      {{ movie.title }}
    </div>
    <div class="movie-card__desc my-2">
      {{ movie.overview }}
    </div>
    <div class="movie-card__actions py-3">
      <div class="btn-group">
        <button class="btn btn-green-400 text-white flex-grow">
          Add Movie
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { TMDBMovie } from "@/types/tmdb";

@Component
export default class CardSearchResult extends Vue {
  @Prop(Object) readonly movie!: TMDBMovie;
}
</script>
