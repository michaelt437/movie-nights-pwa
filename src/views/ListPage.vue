<template>
  <div>
     <div class="btn-group mb-2">
      <button class="btn btn-transparent text-gray-400 text-md ml-auto">
        Filters <i class="fas fa-sliders-h ml-2"></i>
      </button>
    </div>
    <template v-for="movie in movieList">
      <card-movie-editable
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
  public movieList: Array<IMovie> = [
    {
      title: "Annihilation",
      service: {
        title: "Hulu",
        value: "hulu"
      },
      duration: 119,
      watchDate: 123134
    },
    {
      title: "Blade Runner 2049",
      service: {
        title: "Netflix",
        value: "netflix"
      },
      duration: 145,
      watchDate: 123134
    },
    {
      title: "The Lighthouse",
      service: {
        title: "Amazon Prime",
        value: "amazon"
      },
      duration: 92,
      watchDate: 123134
    },
    {
      title: "The Martian",
      service: {
        title: "DVD/Bluray",
        value: "disc"
      },
      duration: 132,
      watchDate: 123134
    }
  ];
}
</script>