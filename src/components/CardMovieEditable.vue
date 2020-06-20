<template>
  <div class="movie-card rounded-lg text-gray-200 px-5 py-3 mb-4 flex" :class="excludeMovie ? 'bg-gray-900 movie-card--exclude' : 'bg-gray-800'">
    <div class="flex-grow">
      <div class="movie-card__title text-2xl">
        {{ movie.title }}
      </div>
      <div class="movie-card__service text-md my-2" :class="movie.service.value">{{ movie.service.title }}</div>
      <div class="movie-card__footer flex justify-between">
        <div class="movie-card__duration text-sm">{{ movie.duration }} minutes</div>
      </div>
    </div>
    <div class="flex flex-col justify-between items-center py-1">
      <label :for="`exclude-${titleCamelCase}`">
        <input type="checkbox" name="excludeMovie" :id="`exclude-${titleCamelCase}`" v-model="excludeMovie" hidden>
        <i class="text-2xl text-blue-400 cursor-pointer" :class="excludeMovie ? 'far fa-circle' : 'fas fa-check-circle'"></i>
      </label>
      <div class="movie-card__delete text-red-400"><i class="fas fa-trash"></i></div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import IMovie from "@/interface/IMovie";

@Component
export default class CardMovie extends Vue {
  @Prop(Object) readonly movie!: IMovie;

  private excludeMovie = false;

  get titleCamelCase () {
    return this.movie.title.split(" ").join("");
  }
}
</script>
<style lang="scss" scoped>
  .movie-card, .movie-card > * {
    transition: all .2s ease-out;
  }

  .movie-card--exclude {
    .movie-card__title, .movie-card__service, .movie-card__duration {
      opacity: .5;
    }
  }
</style>
