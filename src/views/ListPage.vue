<template>
  <div id="list-page" class="relative">
    <div class="btn-group items-center mb-2 relative">
      <i class="fas fa-search text-gray-500 absolute"></i>
      <div class="input search flex-grow mb-0">
        <input
          type="text"
          id="search-input"
          v-model="searchInput"
          placeholder="Search..."
          class="pl-6 w-full"
        >
      </div>
      <button
        class="btn btn-transparent text-md"
        :class="activeFilters ? 'text-teal-400' : 'text-gray-400'"
        @click="invokeDrawer">
        <span v-show="activeFilters">{{ activeFilters }}</span> Filter<span v-show="activeFilters > 1">s</span> <i class="fas fa-sliders-h ml-2"></i>
      </button>
    </div>
    <template v-for="movie in filteredMovies">
      <card-movie-editable
      v-on="$listeners"
      :key="movie.title"
      :movie="movie" />
    </template>
    <div class="pt-4 py-16 text-gray-600 text-center">Your beginning...</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CardMovieEditable from "@/components/CardMovieEditable.vue";
import IMovie from "@/interface/IMovie";

@Component({
  components: {
    CardMovieEditable
  }
})
export default class ListPage extends Vue {
  public searchInput = "";

  get moviesToWatch (): Array<IMovie> {
    return this.$store.getters.getMoviesToWatch;
  }

  get filteredMovies (): Array<IMovie> {
    return this.$store.getters.getMoviesToWatch.filter(movie => {
      return movie.title.toLowerCase().includes(this.searchInput) ||
        movie.service.title.toLowerCase().includes(this.searchInput);
    });
  }

  get activeFilters (): number {
    let count = 0;
    if (this.$store.state.orderFilter !== "") count++;
    if (this.$store.state.excludeFilter !== "") count++;
    if (this.$store.state.durationFilters.length) count++;
    if (this.$store.state.serviceFilters.length) count++;
    return count;
  }

  invokeDrawer (): void {
    this.$emit("drawer", "DrawerFilter");
  }
}
</script>
