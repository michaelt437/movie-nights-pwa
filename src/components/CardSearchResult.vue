<template>
  <div class="movie-card rounded-lg bg-white text-gray-600 px-5 py-3 mb-4">
    <div
      class="movie-card__title flex items-center font-bold text-lg capitalize"
    >
      {{ movie.title }}
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
import { TMDBMovie, TMDBStreamProvider } from "@/types/tmdb";

@Component
export default class CardSearchResult extends Vue {
  @Prop(Object) readonly movie!: TMDBMovie;

  get movieToAdd (): IMovie {
    const _movie: IMovie = {
      ...this.movie,
      hasWatched: false,
      providers: [],
      addedDate: Number(Date.parse(Date())),
      exclude: false,
      watchDate: 0
    };
    return _movie;
  }

  get isDuplicate (): boolean {
    return (
      this.$store.getters.getMoviesToWatch.findIndex(
        (m) => m.id === this.movie.id
      ) > -1
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
    const movieToAddWithProviders = {
      ...this.movieToAdd,
      providers: await this.watchProviders()
    };
    if (!this.isDuplicate) this.$emit("add-movie", this.movieToAdd);
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
