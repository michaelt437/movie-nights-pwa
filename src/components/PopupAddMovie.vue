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
        ref="searchInput"
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
    <div class="popup-content overflow-y-auto px-5">
      <card-search-result
        v-for="result in searchResults"
        :key="result.id"
        :movie="result"
        @add-movie="addMovie"
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

  get checkForPendingDuplicate (): boolean {
    return false;
  }

  get isRewatch (): boolean {
    return false;
  }

  get searchResults () {
    return this.$store.state.searchResults;
  }

  @Watch("searchText")
  searchMovie (searchText: string) {
    if (searchText.trim() !== "") this.executeSearchMovie(searchText);
  }

  addMovie (movieToAdd: IMovie): void {
    db.collection(this.$store.getters.getCurrentUserDocumentId)
      .add(movieToAdd)
      .then(() => {
        this.$emit(
          "toaster",
          `${movieToAdd.title.toUpperCase()} has been added.`
        );
        this.closeDrawer();
      });
  }

  clearSearch (): void {
    this.searchText = "";
    (this.$refs.searchInput as HTMLInputElement).focus();
  }

  closeDrawer (): void {
    this.$emit("closeDrawer");
    this.clearSearchResults();
  }

  clearSearchResults (): void {
    this.$store.commit("setSearchResults", []);
  }

  executeSearchMovie = debounce((searchText: string) => {
    this.$store.dispatch("searchMovie", { searchText });
  }, 1000);
}
</script>
