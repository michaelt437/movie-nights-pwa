<template>
  <div class="flex flex-col rounded-lg bg-indigo-600 text-gray-200 px-5 mb-4 h-full">
    <p class="text-2xl text-center py-5">Edit Details</p>
    <div class="popup-content overflow-y-auto">
      <label for="movie-title" class="text-sm">
        Movie Title
        <span v-show="checkForPendingDuplicate" class="text-red-500 italic"> - Duplicate title not yet picked</span>
      </label>
      <div class="input">
        <input
          type="text"
          name="movie-title"
          id="movie-title"
          autocomplete="off"
          v-model="movieToEdit.title"
          :placeholder="randomMovieTitle">
      </div>
      <label for="movie-duration" class="text-sm">Duration</label>
      <div class="input">
        <input
          type="text"
          name="movie-duration"
          id="movie-duration"
          autocomplete="off"
          v-model="movieToEdit.duration"
          placeholder="90">
      </div>
      <label for="movie-service" class="text-sm">Streaming Service</label>
      <select
        name="movie-service"
        id="movie-service"
        v-model="movieToEdit.service">
        <option value="" selected disabled hidden>1channel.rus</option>
        <option
          v-for="service in services"
          :key="service.title"
          :value="service">{{ service.title }}</option>
      </select>
      <label for="movie-service" class="text-sm">Genres</label>
      <div class="chip-group flex-wrap mb-5">
        <template v-for="genre in placeholders.genres">
          <label
            :key="genre.value"
            :for="genre.value"
            :class="hasGenre(genre.value)"
            class="chip"
            >
              <input type="checkbox" :name="genre.value" :id="genre.value" :value="genre" v-model="movieToEdit.genres" hidden>
              {{ genre.title }}
          </label>
        </template>
      </div>
    </div>
    <div class="btn-group flex py-3">
      <span class="ml-auto"></span>
      <button class="btn btn-gray-400 outline" style="flex-basis: 30%;" @click="closePopup">
        <i class="fas fa-times mr-1"></i> Cancel
      </button>
      <button
        :class="{ 'disabled' : disableButton }"
        class="btn btn-green-400"
        style="flex-basis: 30%;"
        @click="submitEdits">
        <i class="fas fa-check mr-1"></i> Save
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import placeholders from "@/placeholders";
import IMovie from "@/interface/IMovie";
import IService from "@/interface/IService";
import IGenre from "@/interface/IGenre";
import { db } from "@/db.ts";
import { omit, isEqual } from "lodash";

@Component
export default class PopupEditMovie extends Vue {
  @Prop(Object) readonly movie!: IMovie;
  @Prop() readonly action?: Function;

  movieToEdit: IMovie = {
    documentId: "",
    title: "",
    service: {
      title: "",
      value: ""
    },
    duration: 0,
    genres: []
  }

  placeholders = placeholders;

  get randomMovieTitle (): string {
    const placeholderMoviesArrayLength = placeholders.movies.length;
    const randomPlaceholderIndex = Math.floor(Math.random() * placeholderMoviesArrayLength);
    return placeholders.movies[randomPlaceholderIndex];
  }

  get services (): Array<IService> {
    return placeholders.streamingService;
  }

  get disableButton (): boolean {
    return isEqual(this.movie, this.movieToEdit) ||
      this.checkForPendingDuplicate;
  }

  get checkForPendingDuplicate (): boolean {
    return this.$store.getters.getMoviesToWatch.find(movie => {
      return movie.title.toLowerCase() === this.movieToEdit.title.toLowerCase();
    }) && this.movieToEdit.title !== this.movie.title;
  }

  get movieToEditOmitId (): IMovie {
    return omit(this.movieToEdit, "documentId");
  }

  hasGenre (genre: string): object {
    return {
      active: this.movieToEdit.genres.find((genreObj: IGenre) => genreObj.value === genre)
    };
  }

  closePopup (): void {
    this.action!();
    this.$emit("closePopup");
  }

  submitEdits (): void {
    db.collection(this.$store.getters.getCurrentUserDocumentId)
      .doc(this.movie.documentId)
      .update(this.movieToEditOmitId);
    this.$store.commit("submitEditsToMovie", this.movieToEdit);
    this.action!();
    this.closePopup();
  }

  mounted () {
    this.movieToEdit = JSON.parse(JSON.stringify(this.movie));
  }
}
</script>
