<template>
  <div id="list-page" class="relative flex-grow md:flex-grow-0">
    <div
      class="
        flex
        items-center
        mb-12
        border border-gray-700
        rounded-md
        px-3
        py-1
      "
    >
      <i class="fas fa-search text-gray-500 absolute"></i>
      <div class="input search w-full relative">
        <input
          type="text"
          id="search-input"
          placeholder="Search..."
          autocomplete="off"
          class="pl-6 w-full outline-none"
          :value="searchInput"
          @input="updateSearchInput($event)"
        />
        <span
          v-show="searchInput !== ''"
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
    </div>
    <div
      class="btn-group items-center justify-between mb-4 relative text-gray-200"
    >
      <div class="btn btn-pink-600 pointer-events-none">
        <span v-show="activeFilters">Showing</span> {{ filteredMovies.length }}
      </div>
      <button
        class="btn border text-md"
        :class="activeFilters ? 'btn-green-400' : 'btn-gray-500 outline'"
        @click="invokeDrawer"
      >
        <span v-show="activeFilters">{{ activeFilters }}</span> Filter<span
          v-show="activeFilters > 1"
          >s</span
        >
        <i class="fas fa-sliders-h ml-2"></i>
      </button>
    </div>
    <template v-for="movie in filteredMovies">
      <card-movie-editable
        v-on="$listeners"
        :key="movie.documentId"
        :movie="movie"
      />
    </template>
    <div class="pt-4 py-16 text-gray-600 text-center">Your beginning...</div>
    <div class="pt-4 py-16 text-gray-600 text-center">
      Streaming provider data via JustWatch
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CardMovieEditable from "@/components/CardMovieEditable.vue";
import IMovie from "@/types/interface/IMovie";

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
    return this.$store.getters.getMoviesToWatch
      .filter((movie: IMovie) => {
        return (
          movie.title.toLowerCase().includes(this.searchInput.toLowerCase()) ||
          movie.providers[0]?.provider_name
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          movie
            .customProviderModel!.provider_name!.toLowerCase()
            .includes(this.searchInput.toLowerCase())
        );
      })
      .filter((movie: IMovie) => {
        if (this.$store.getters.getServiceFilters.length) {
          if (movie.customProvider) {
            return this.$store.getters.getServiceFilters.includes(
              movie.customProviderModel!.provider_name
            );
          } else {
            return this.$store.getters.getServiceFilters.includes(
              movie.providers[0]?.provider_name
            );
          }
        } else {
          return true;
        }
      })
      .filter((movie: IMovie) => {
        if (this.$store.getters.getDurationFilters.length) {
          if (this.$store.getters.getDurationFilters.includes("short")) {
            if (Number(movie.runtime) < 107) {
              return movie;
            }
          }
          if (this.$store.getters.getDurationFilters.includes("long")) {
            if (Number(movie.runtime) >= 107 && Number(movie.runtime) <= 134) {
              return movie;
            }
          }
          if (this.$store.getters.getDurationFilters.includes("realLong")) {
            if (Number(movie.runtime) > 134) {
              return movie;
            }
          }
        } else {
          return true;
        }
      })
      .filter((movie: IMovie) => {
        if (this.$store.getters.getGenreFilters.length) {
          return movie.genres.some((genre) => {
            return this.$store.getters.getGenreFilters.includes(genre.name);
          });
        } else {
          return true;
        }
      })
      .sort((movie1: IMovie, movie2: IMovie): number => {
        switch (this.$store.getters.getOrderFilter) {
          case "alpha":
            if (movie1.title.toLowerCase() > movie2.title.toLowerCase()) {
              return 1;
            } else if (
              movie1.title.toLowerCase() < movie2.title.toLowerCase()
            ) {
              return -1;
            } else {
              return 0;
            }
          case "duration_asc":
            if (Number(movie1.runtime) > Number(movie2.runtime)) {
              return 1;
            } else if (Number(movie1.runtime) < Number(movie2.runtime)) {
              return -1;
            } else {
              return 0;
            }
          case "duration_desc":
            if (Number(movie2.runtime) > Number(movie1.runtime)) {
              return 1;
            } else if (Number(movie2.runtime) < Number(movie1.runtime)) {
              return -1;
            } else {
              return 0;
            }
          case "service_abc":
            if (movie1.providers.length && movie2.providers.length) {
              if (
                movie1.providers[0].provider_name.toLowerCase() >
                movie2.providers[0].provider_name.toLowerCase()
              ) {
                return 1;
              } else if (
                movie1.providers[0].provider_name.toLowerCase() <
                movie2.providers[0].provider_name.toLowerCase()
              ) {
                return -1;
              } else {
                return 0;
              }
            } else if (movie1.providers.length && !movie2.providers.length) {
              return -1;
            } else if (!movie1.providers.length && movie2.providers.length) {
              return 1;
            } else {
              return 0;
            }
          default:
            return 0;
        }
      })
      .sort((movie1: IMovie, movie2: IMovie): number => {
        switch (this.$store.getters.getExcludeFilter) {
          case "exclude":
            if (!movie1.exclude && movie2.exclude) {
              return 1;
            } else if (movie1.exclude && !movie2.exclude) {
              return -1;
            } else {
              return 0;
            }
          case "available":
            if (movie1.exclude && !movie2.exclude) {
              return 1;
            } else if (!movie1.exclude && movie2.exclude) {
              return -1;
            } else {
              return 0;
            }
          default:
            return 0;
        }
      });
  }

  get activeFilters (): number {
    let count = 0;
    if (this.$store.state.orderFilter !== "") count++;
    if (this.$store.state.excludeFilter !== "") count++;
    if (this.$store.state.durationFilters.length) count++;
    if (this.$store.state.serviceFilters.length) count++;
    if (this.$store.state.genreFilters.length) count++;
    return count;
  }

  invokeDrawer (): void {
    this.$emit("drawer", "DrawerFilter");
  }

  clearSearch (): void {
    this.searchInput = "";
  }

  updateSearchInput (inputEvent: InputEvent): void {
    this.searchInput = (inputEvent.target as HTMLInputElement).value.trim();
  }

  beforeDestroy (): void {
    this.$store.commit("resetListPageFilters");
  }
}
</script>
