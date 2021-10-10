<template>
  <div id="home-page" class="flex-grow sm:flex-grow-0">
    <!-- tonight's pick -->
    <card-tonights-pick v-if="$store.getters.getTonightsPick !== null" />

    <!-- Rolling card -->
    <card-movie-roll v-on="$listeners" v-else />

    <!-- Picked cards -->
    <card-movie
      v-for="(movie, index) in moviesWatched"
      :key="`${movie.title}_${index}`"
      :movie="movie"
    />
    <div class="pt-4 py-16 text-gray-600 text-center">Your beginning...</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IMovie from "@/types/interface/IMovie";
import CardMovie from "@/components/CardMovie.vue";
import CardMovieRoll from "@/components/CardMovieRoll.vue";
import CardTonightsPick from "@/components/CardTonightsPick.vue";

@Component({
  components: {
    CardMovie,
    CardMovieRoll,
    CardTonightsPick
  }
})
export default class Home extends Vue {
  // Fields
  private name = "";
  private email = "";
  private photo = "";
  public signedIn = false;
  private paralaxOffset = 0;
  public titleBgSolid = false;
  public isPicking = false;

  get moviesWatched (): Array<IMovie> {
    return this.$store.getters.getMoviesWatched;
  }

  beforeDestroy (): void {
    this.$store.commit("resetPickFilters");
  }
}
</script>
