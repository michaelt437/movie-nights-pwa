<template>
  <div
    class="flex flex-col rounded-lg bg-indigo-600 text-gray-200 px-5 mb-4 relative h-full"
    :class="{ addSuccess: success }"
  >
    <p class="text-2xl text-center py-5">Add a movie</p>
    <div class="popup-content overflow-y-auto">
      <label for="movie-title" class="text-sm">
        Movie Title
        <span v-show="checkForPendingDuplicate" class="text-red-500 italic">
          - Already in the list</span
        >
        <span v-show="isRewatch" class="text-green-500"> - Rewatch</span>
      </label>
      <div class="input">
        <input
          type="text"
          name="movie-title"
          id="movie-title"
          autocomplete="off"
          v-model="movieToAdd.title"
          :placeholder="randomMovieTitle"
        />
      </div>
    </div>
    <div class="btn-group flex py-3">
      <span class="ml-auto"></span>
      <button
        class="btn btn-white outline"
        style="flex-basis: 30%;"
        @click="closePopup"
      >
        <i class="fas fa-times mr-1"></i> Cancel
      </button>
      <button
        :class="{ disabled: disableButton }"
        class="btn btn-green-400"
        style="flex-basis: 30%;"
        @click="disableButton ? null : addMovie()"
      >
        <i class="fas fa-plus mr-1"></i> Add
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { db } from "@/db";
import placeholders from "@/placeholders";
import IMovie from "@/types/interface/IMovie";

@Component
export default class PopupAddMovie extends Vue {
  movieToAdd = {
    title: "",
    service: "",
    duration: "",
    watchDate: 0,
    hasWatched: false,
    exclude: false,
    genres: []
  };

  placeholders = placeholders;
  success = false;

  get randomMovieTitle (): string {
    const placeholderMoviesArrayLength = placeholders.movies.length;
    const randomPlaceholderIndex = Math.floor(
      Math.random() * placeholderMoviesArrayLength
    );
    return placeholders.movies[randomPlaceholderIndex];
  }

  get disableButton (): boolean {
    return (
      this.movieToAdd.title === "" ||
      this.movieToAdd.duration === "" ||
      this.movieToAdd.duration === "0" ||
      this.movieToAdd.service === "" ||
      this.checkForPendingDuplicate
    );
  }

  get checkForPendingDuplicate (): boolean {
    return Boolean(
      this.$store.getters.getMoviesToWatch.find(movie => {
        return (
          movie.title.toLowerCase() === this.movieToAdd.title.toLowerCase()
        );
      })
    );
  }

  get isRewatch (): boolean {
    return Boolean(
      this.$store.getters.getAllMovies.find((movie: IMovie) => {
        return (
          movie.title.toLowerCase() === this.movieToAdd.title.toLowerCase() &&
          movie.hasWatched === true
        );
      })
    );
  }

  resetMovieModel (): void {
    this.movieToAdd = {
      title: "",
      service: "",
      duration: "",
      watchDate: 0,
      hasWatched: false,
      exclude: false,
      genres: []
    };
  }

  addMovie (): void {
    db.collection(this.$store.getters.getCurrentUserDocumentId)
      .add(this.movieToAdd)
      .then(() => {
        this.$emit(
          "toaster",
          `${this.movieToAdd.title.toUpperCase()} has been added.`
        );
        this.closePopup();
      });
  }

  closePopup (): void {
    this.$emit("closePopup");
    this.resetMovieModel();
  }
}
</script>
