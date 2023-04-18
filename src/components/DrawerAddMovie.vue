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
        ref="searchInput"
        :placeholder="`Search for ${randomMovieTitle}...`"
        :value="searchText"
        @input="updateSearchText($event)"
      /><span
        v-show="searchText !== ''"
        id="input-clear"
        class="cursor-pointer"
        @click="clearSearch()"
      >
        <i
          aria-label="Clear search"
          title="Clear search"
          class="fas text-gray-500"
          :class="isSearching ? 'fa-sync-alt fa-spin' : 'fa-times'"
        ></i>
      </span>
    </div>
    <div class="popup-content overflow-y-auto px-5">
      <template v-if="!searchResults.length">
        <div class="rounded-lg px-5 py-16 text-center">
          <i class="fas fa-search fa-5x text-gray-300"></i>
        </div>
      </template>
      <card-search-result
        v-else
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
export default class DrawerAddMovie extends Vue {
  searchText = "";
  placeholders = placeholders;
  success = false;
  isSearching = false;

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
    this.isSearching = true;
    if (searchText.trim() !== "") this.executeSearchMovie(searchText);
  }

  addMovie (movieToAdd: IMovie): void {
    if (this.$store.state.signedIn) {
      // db.collection(this.$store.getters.getCurrentUserDocumentId)
      //   .add(movieToAdd)
      //   .then(() => {
      //     this.$emit(
      //       "toaster",
      //       `${movieToAdd.title.toUpperCase()} has been added.`
      //     );
      //   });
    } else {
      this.$store.commit("addMovieToList", movieToAdd);
      this.$emit(
        "toaster",
        `${movieToAdd.title.toUpperCase()} has been added with ${
          movieToAdd.providers.length
        } providers.`
      );
    }
    if (this.$route.name !== "Movie Pool") {
      this.$router.push({ name: "Movie Pool" });
    }
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

  updateSearchText (inputEvent: InputEvent): void {
    this.searchText = (inputEvent.target as HTMLInputElement).value;
  }

  setFalse (): void {
    this.isSearching = false;
  }

  executeSearchMovie = debounce(async (searchText: string) => {
    await this.$store.dispatch("searchMovie", { searchText });
    this.setFalse();
  }, 1000);
}
</script>
