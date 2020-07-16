<template>
  <div class="movie-card rounded-lg text-gray-200 mb-4 flex flex-col overflow-hidden" :class="excludeMovie ? 'bg-gray-900 movie-card--exclude' : 'bg-gray-800'" @click="showActions = !showActions">
    <div class="movie-card__content py-3 px-5">
      <div class="movie-card__title text-2xl flex justify-between items-center capitalize">
        {{ movie.title }}
        <label :for="`exclude-${titleCamelCase}`">
          <input type="checkbox" name="excludeMovie" :id="`exclude-${titleCamelCase}`" v-model="excludeMovie" hidden>
          <span class="text-3xl text-blue-400 cursor-pointer">
            <i v-show="excludeMovie" class="far fa-circle"></i>
            <i v-show="!excludeMovie" class="fas fa-check-circle"></i>
          </span>
        </label>
      </div>
      <div class="movie-card__service text-md my-2" :class="movie.service.value">{{ movie.service.title }}</div>
      <div class="movie-card__footer flex justify-between flex justify-between items-center">
        <div class="movie-card__duration text-sm">{{ movie.duration }} minutes</div>
        <i class="fas mr-2 text-gray-400" :class="showActions ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </div>
    </div>
    <div v-show="showActions" class="movie-card__actions px-5 py-3">
      <div class="btn-group">
        <button class="btn btn-teal-600 flex-grow" @click.stop="editMovie">
          Edit
        </button>
        <button class="btn btn-red-600 flex-grow" @click.stop="deletePrompt">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import IMovie from "@/interface/IMovie";
import { db } from "@/db.ts";

@Component
export default class CardMovieEditable extends Vue {
  @Prop(Object) readonly movie!: IMovie;

  private excludeMovie = false;
  private showActions = false;

  @Watch("excludeMovie", { immediate: true, deep: true })
  onExcludeToggle (value: boolean) {
    db.collection(this.$store.getters.getCurrentUserDocumentId)
      .doc(this.movie.documentId)
      .update({
        exclude: value
      });
  }

  get titleCamelCase () {
    return this.movie.title.split(" ").join("");
  }

  editMovie (): void {
    this.$emit("popup", "PopupEditMovie", this.movie);
  }

  deletePrompt (): void {
    this.$emit("popup", "PopupConfirm", this.movie, "Are you sure you want to delete this movie?", this.deleteMovie);
  }

  deleteMovie (): void {
    db.collection(this.$store.getters.getCurrentUserDocumentId)
      .doc(this.movie.documentId)
      .delete();
    this.$store.commit("deleteMovieFromList", this.movie);
  }

  mounted () {
    this.excludeMovie = this.movie.exclude!;
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
