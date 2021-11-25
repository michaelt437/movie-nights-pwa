<template>
  <div class="px-5 py-3">
    <div class="flex text-gray-500 justify-between items-center mb-6">
      <h2 class="text-4xl">Categories: {{ pickCategories }}</h2>
      <i class="fas fa-times" @click="closeDrawer"></i>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Duration</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="option in availableRuntimeOptions">
        <label
          :key="option.value"
          :for="option.value"
          :class="{ active: durationCategories.includes(option.value) }"
          class="chip"
        >
          <input
            type="checkbox"
            :name="option.value"
            :id="option.value"
            :value="option.value"
            v-model="durationCategories"
            hidden
          />
          {{ option.label }}
        </label>
      </template>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Service</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="provider in availableProviders">
        <label
          :key="provider.provider_id"
          :for="provider.provider_id"
          :class="{
            active: serviceCategories.includes(provider.provider_name)
          }"
          class="chip"
        >
          <input
            type="checkbox"
            :name="provider.provider_id"
            :id="provider.provider_id"
            :value="provider.provider_name"
            v-model="serviceCategories"
            hidden
          />
          {{ provider.provider_name }}
        </label>
      </template>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Genres</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="genre in availableGenres">
        <label
          :key="genre.id"
          :for="genre.id"
          :class="{ active: genreCategories.includes(genre.name) }"
          class="chip"
        >
          <input
            type="checkbox"
            :name="genre.id"
            :id="genre.id"
            :value="genre.name"
            v-model="genreCategories"
            hidden
          />
          {{ genre.name }}
        </label>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TMDBGenre, TMDBStreamProvider } from "@/types/tmdb";
import IMovie from "@/types/interface/IMovie";

@Component
export default class DrawerPickFilter extends Vue {
  durationOptions = [
    { label: "Short", value: "short" },
    { label: "Long", value: "long" },
    { label: "Real Long", value: "realLong" }
  ];

  get availableRuntimeOptions (): { label: string; value: string }[] {
    const availableRuntimes: { label: string; value: string }[] = [];
    this.$store.getters.getMoviesToWatch.forEach((movie: IMovie) => {
      if (!movie.exclude && movie.providers.length) {
        if (movie.runtime < 107) {
          if (!availableRuntimes.find((r) => r.value === "short")) {
            console.log("adding short option", movie.title);
            availableRuntimes.push({ label: "Short", value: "short" });
          }
        }
        if (movie.runtime >= 107 && movie.runtime <= 134) {
          if (!availableRuntimes.find((r) => r.value === "long")) {
            console.log("adding long option", movie.title);
            availableRuntimes.push({ label: "Long", value: "long" });
          }
        }
        if (movie.runtime > 134) {
          if (!availableRuntimes.find((r) => r.value === "realLong")) {
            console.log("adding real long", movie.title);
            availableRuntimes.push({ label: "Real Long", value: "realLong" });
          }
        }
      }
    });
    return availableRuntimes;
  }

  get availableProviders (): TMDBStreamProvider[] {
    const availableProviders: TMDBStreamProvider[] = [];
    this.$store.getters.getMoviesToWatch.forEach((movie: IMovie) => {
      if (!movie.exclude && movie.providers.length) {
        if (
          !availableProviders.find(
            (provider) =>
              provider.provider_name === movie.providers[0].provider_name
          )
        ) {
          availableProviders.push(movie.providers[0]);
        }
      }
    });
    return availableProviders;
  }

  get availableGenres (): TMDBGenre[] {
    const availableGenres: TMDBGenre[] = [];
    this.$store.getters.getMoviesToWatch.forEach((movie: IMovie) => {
      // TODO remove check for providers.length, after excluding unavailable films with issue #63
      if (!movie.exclude && movie.providers.length) {
        movie.genres.forEach((genre: TMDBGenre) => {
          if (
            !availableGenres.find(
              (genreValue: TMDBGenre) => genreValue.id === genre.id
            )
          ) {
            availableGenres.push(genre);
          }
        });
      }
    });
    return availableGenres;
  }

  get durationCategories (): Array<string> {
    return this.$store.getters.getDurationCategories;
  }

  set durationCategories (value: Array<string>) {
    this.$store.commit("setDurationCategories", value);
  }

  get serviceCategories (): Array<string> {
    return this.$store.getters.getServiceCategories;
  }

  set serviceCategories (value: Array<string>) {
    this.$store.commit("setServiceCategories", value);
  }

  get genreCategories (): Array<string> {
    return this.$store.getters.getGenreCategories;
  }

  set genreCategories (value: Array<string>) {
    this.$store.commit("setGenreCategories", value);
  }

  get pickCategories (): number | string {
    let pickingFrom: number | string = 0;
    if (this.$store.getters.getDurationCategories.length) {
      pickingFrom += this.$store.getters.getDurationCategories.length;
    }
    if (this.$store.getters.getServiceCategories.length) {
      pickingFrom += this.$store.getters.getServiceCategories.length;
    }
    if (this.$store.getters.getGenreCategories.length) {
      pickingFrom += this.$store.getters.getGenreCategories.length;
    }
    return !pickingFrom ? "All" : pickingFrom;
  }

  uncheckRadio (e, type): void {
    if (e.currentTarget.classList.contains("active")) {
      e.currentTarget.lastElementChild.checked = false;
      this[`${type}Filter`] = "";
      e.preventDefault();
    }
  }

  closeDrawer (): void {
    this.$emit("closeDrawer");
  }
}
</script>
