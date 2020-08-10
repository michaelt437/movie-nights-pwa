<template>
  <div
    class="rounded-lg bg-indigo-600 text-gray-200 px-5 pb-3 mb-4 relative"
    :class="{ 'addSuccess' : success}">
    <p class="text-2xl text-center py-5">Add a movie</p>
    <label for="movie-title" class="text-sm">
      Movie Title
      <span v-show="checkForPendingDuplicate" class="text-red-500 italic"> - Duplicate title not yet picked</span>
    </label>
    <div class="input">
      <input
        type="text"
        name="movie-title"
        id="movie-title"
        v-model="movieToAdd.title"
        :placeholder="randomMovieTitle">
    </div>
    <label for="movie-duration" class="text-sm">Duration</label>
    <div class="input">
      <input
        type="text"
        name="movie-duration"
        id="movie-duration"
        v-model="movieToAdd.duration"
        placeholder="90">
    </div>
    <label for="movie-service" class="text-sm">Streaming Service</label>
    <select
      name="movie-service"
      id="movie-service"
      v-model="movieToAdd.service">
      <option value="" selected disabled hidden>1channel.rus</option>
      <option
        v-for="service in services"
        :key="service.title"
        :value="service">{{ service.title }}</option>
    </select>
    <div class="btn-group flex">
      <span class="ml-auto"></span>
      <button class="btn btn-white outline" style="flex-basis: 30%;" @click="closePopup">
        <i class="fas fa-times mr-1"></i> Cancel
      </button>
      <button
        :class="{ 'disabled' : disableButton }"
        class="btn btn-teal-400"
        style="flex-basis: 30%;"
        @click="addMovie">
        <i class="fas fa-plus mr-1"></i> Add
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { db } from "@/db.ts";
import placeholders from "@/placeholders";
import IMovie from "@/interface/IMovie";
import IService from "@/interface/IService";

@Component
export default class PopupAddMovie extends Vue {
  movieToAdd = {
    title: "",
    service: "",
    duration: "",
    watchDate: 0,
    hasWatched: false,
    exclude: false
  }

  success = false;

  get randomMovieTitle (): string {
    const placeholderMoviesArrayLength = placeholders.movies.length;
    const randomPlaceholderIndex = Math.floor(Math.random() * placeholderMoviesArrayLength);
    return placeholders.movies[randomPlaceholderIndex];
  }

  get services (): Array<IService> {
    return placeholders.streamingService;
  }

  get disableButton (): boolean {
    return this.movieToAdd.title === "" ||
      this.movieToAdd.duration === "" || this.movieToAdd.duration === "0" ||
      this.movieToAdd.service === "" ||
      this.checkForPendingDuplicate;
  }

  get checkForPendingDuplicate (): boolean {
    return Boolean(this.$store.getters.getMoviesToWatch.find(movie => {
      return movie.title.toLowerCase() === this.movieToAdd.title.toLowerCase();
    }));
  }

  resetMovieModel (): void {
    this.movieToAdd = {
      title: "",
      service: "",
      duration: "",
      watchDate: 0,
      hasWatched: false,
      exclude: false
    };
  }

  addMovie (): void {
    db.collection(this.$store.getters.getCurrentUserDocumentId)
      .add(this.movieToAdd)
      .then(() => {
        this.resetMovieModel();
        this.success = true;
        setTimeout(() => {
          this.success = false;
          this.$emit("closePopup");
        }, 1000);
      });
  }

  closePopup (): void {
    this.$emit("closePopup");
    this.resetMovieModel();
  }
}
</script>
