<template>
  <div id="list-page">
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
      <button class="btn btn-transparent text-gray-400 text-md">
        Filters <i class="fas fa-sliders-h ml-2"></i>
      </button>
    </div>
    <template v-for="movie in movieList">
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
  public movieList: Array<IMovie> = [
    {
      title: "Annihilation",
      service: {
        title: "Hulu",
        value: "hulu"
      },
      duration: 119,
      watchDate: 123134,
      exclude: false
    },
    {
      title: "Blade Runner 2049",
      service: {
        title: "Netflix",
        value: "netflix"
      },
      duration: 145,
      watchDate: 123134,
      exclude: true
    },
    {
      title: "The Lighthouse",
      service: {
        title: "Amazon Prime",
        value: "amazon"
      },
      duration: 92,
      watchDate: 123134,
      exclude: false
    },
    {
      title: "The Martian",
      service: {
        title: "DVD/Bluray",
        value: "disc"
      },
      duration: 132,
      watchDate: 123134,
      exclude: false
    }
  ];
}
</script>
