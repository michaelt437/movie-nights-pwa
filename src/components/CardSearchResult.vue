<template>
  <div class="movie-card rounded-lg bg-white text-gray-600 px-5 py-3 mb-4">
    <div
      class="movie-card__title flex items-center font-bold text-lg capitalize"
    >
      {{ movie.title }} ({{ $moment(movie.release_date).format("YYYY") }})
      <i
        v-show="isRewatch && !isDuplicate"
        class="fas fa-sync text-green-300 ml-auto"
        title="Rewatch"
      ></i>
    </div>
    <div class="movie-card__desc max-h-32 overflow-hidden my-2">
      {{ movie.overview }}
    </div>
    <div class="movie-card__actions py-3">
      <div class="btn-group">
        <button
          class="btn text-white flex-grow"
          :class="isDuplicate ? 'btn-gray-400' : 'btn-green-400'"
          :disabled="isDuplicate"
          @click="addMovie"
        >
          {{ isDuplicate ? "Added" : "Add Movie" }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import IMovie from "@/types/interface/IMovie";
import { TMBDMovieSearch, TMDBStreamProvider } from "@/types/tmdb";

@Component
export default class CardSearchResult extends Vue {
  @Prop(Object) readonly movie!: TMBDMovieSearch;

  get isDuplicate (): boolean {
    return (
      this.$store.getters.getMoviesToWatch.findIndex(
        (m) => m.id === this.movie.id
      ) > -1
    );
  }

  get isRewatch (): boolean {
    return Boolean(
      this.$store.getters.getMoviesWatched.find((paramMovie: IMovie) => {
        if (paramMovie.service) {
          return (
            paramMovie.title.toLowerCase() === this.movie.title.toLowerCase() &&
            paramMovie.hasWatched
          );
        }
        if (paramMovie.id) {
          return paramMovie.id === this.movie.id && paramMovie.hasWatched;
        }
      })
    );
  }

  async watchProviders (): Promise<TMDBStreamProvider[]> {
    return this.$store
      .dispatch("fetchWatchProviders", {
        movieId: this.movie.id
      })
      .then((data) => data);
  }

  async addMovie (): Promise<void> {
    const movieWithDetails = await this.$store.dispatch("fetchMovieDetails", {
      movieId: this.movie.id
    });
    const movieWithDetailsParam: IMovie = {
      ...movieWithDetails,
      providers: await this.watchProviders(),
      exclude: false,
      hasWatched: false,
      addedDate: Number(Date.parse(Date()))
    };
    this.$emit("add-movie", movieWithDetailsParam);
  }
}
</script>
<style lang="scss" scoped>
.movie-card__desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
