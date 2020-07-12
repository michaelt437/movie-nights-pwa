<template>
  <div id="home-page">
    <!-- Tabs -->
    <!-- <div class="tabs mb-8 sticky" style="top: 55px;">
      <div class="tab active" style="flex-basis: 50%;">Movies</div>
      <div class="tab" style="flex-basis: 50%;">TV</div>
    </div> -->
    <!-- <div class="btn-group mb-16">
      <button class="btn btn-orange-500 text-white">Movies List</button>
      <button class="btn btn-gray-200 outline text-gray-200">TV List</button>
    </div> -->

    <!-- Filters -->
    <!-- <div class="btn-group mb-2">
      <button class="btn btn-teal-500 outline text-white">Time <i class="fas fa-caret-down ml-1"></i></button>
      <button class="btn btn-teal-500 outline text-white">Service <i class="fas fa-caret-down ml-1"></i></button>
    </div> -->

    <!-- Rolling Card -->
    <div v-if="isPicking" class="movie-card rounded-lg bg-indigo-600 text-gray-200 px-5 py-3 mb-4">
      <div class="movie-card__title text-2xl">Annihilation</div>
      <div class="movie-card__service text-green-300 text-lg my-2">Hulu</div>
      <div class="movie-card__duration text-sm mb-5">119 minutes</div>
      <div class="movie-card__footer">
        <div class="btn-group flex">
          <button class="btn btn-white outline flex-grow" @click="isPicking = false">
            <i class="fas fa-times"></i>
          </button>
          <button class="btn btn-pink-600 flex-grow">
            <i class="fas fa-dice"></i> (4)
          </button>
          <button class="btn btn-teal-400 flex-grow" style="flex-basis: 35%">
            <i class="fas fa-check"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Dice Card -->
    <div v-else class="movie-card rounded-lg btn-indigo-600 text-center text-gray-200 py-8 mb-4 cursor-pointer" @click="isPicking = true">
      <div class="text-2xl">What's the pick?</div>
    </div>

    <!-- Picked cards -->
    <card-movie
      v-for="movie in moviesWatched"
      :key="movie.title"
      :movie="movie" />
    <div class="pt-4 py-16 text-gray-600 text-center">Your beginning...</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IMovie from "@/interface/IMovie";
import CardMovie from "@/components/CardMovie.vue";

@Component({
  components: {
    CardMovie
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
}
</script>
