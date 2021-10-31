<template>
  <div
    class="flex flex-col bg-gray-200 py-3 relative h-full"
    :class="{ addSuccess: success }"
  >
    <div class="flex justify-between items-center px-5 mb-6">
      <h2 class="text-4xl">Add a Movie</h2>
      <i class="fas fa-times cursor-pointer" @click="closeDrawer"></i>
    </div>
    <div class="input mx-5 relative">
      <input
        type="text"
        name="movie-title"
        id="movie-title"
        autocomplete="off"
        v-model="searchText"
        :placeholder="`Search for ${randomMovieTitle}...`"
      /><span
        v-show="searchText !== ''"
        id="input-clear"
        class="cursor-pointer"
        @click="clearSearch()"
      >
        <i
          class="fas fa-times text-gray-500"
          aria-label="Clear search"
          title="Clear search"
        ></i>
      </span>
    </div>
    <div class="popup-content overflow-y-auto px-5 ">
      <label for="movie-title" class="text-sm">
        <span v-show="checkForPendingDuplicate" class="text-red-500 italic">
          Already in the list</span
        >
        <span v-show="isRewatch" class="text-green-500"> Rewatch</span>
      </label>
      <card-search-result
        v-for="result in searchResults"
        :key="result.id"
        :movie="result"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { db } from "@/db";
import placeholders from "@/placeholders";
import IMovie from "@/types/interface/IMovie";
import debounce from "lodash/debounce";
import CardSearchResult from "@/components/CardSearchResult.vue";

@Component({
  components: {
    CardSearchResult
  }
})
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

  searchText = "";
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
      this.$store.getters.getMoviesToWatch.find((movie: IMovie) => {
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

  get searchResults () {
    return this.$store.state.searchResults;
  }

  @Watch("searchText")
  searchMovie (searchText: string) {
    if (searchText !== "") {
      this.executeSearchMovie(searchText);
    }
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
        this.closeDrawer();
      });
  }

  clearSearch (): void {
    this.searchText = "";
  }

  closeDrawer (): void {
    this.$emit("closeDrawer");
    this.resetMovieModel();
  }

  executeSearchMovie = debounce((searchText: string) => {
    this.$store.dispatch("searchMovie", { searchText });
  }, 1000);
}
</script>
