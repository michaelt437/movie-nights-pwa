<template>
  <div class="px-5 py-3">
    <div class="flex text-gray-500 justify-between items-center mb-6">
      <h2 class="text-4xl">
        <span v-show="activeFilters">{{ activeFilters }}</span> Filter<span
          v-show="activeFilters > 1"
          >s</span
        >
      </h2>
      <i class="fas fa-times" @click="closeDrawer"></i>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Order</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="option in sortOrder">
        <label
          :key="option.value"
          :for="option.value"
          :class="{ active: orderFilter.includes(option.value) }"
          class="chip rounded-full"
          @click.stop="uncheckRadio($event, 'order')"
        >
          <input
            type="radio"
            :name="option.value"
            :id="option.value"
            :value="option.value"
            v-model="orderFilter"
            hidden
          />
          {{ option.label }}
        </label>
      </template>
    </div>
    <div class="chip-group flex-wrap mb-5">
      <label
        for="availFirst"
        :class="{ active: excludeFilter === 'available' }"
        class="chip rounded-full"
        @click.stop="uncheckRadio($event, 'exclude')"
      >
        <input
          type="radio"
          name="availFirst"
          id="availFirst"
          value="available"
          v-model="excludeFilter"
          hidden
        />
        Available First
      </label>
      <label
        for="excludeFirst"
        :class="{ active: excludeFilter === 'exclude' }"
        class="chip rounded-full"
        @click.stop="uncheckRadio($event, 'exclude')"
      >
        <input
          type="radio"
          name="excludeFirst"
          id="excludeFirst"
          value="exclude"
          v-model="excludeFilter"
          hidden
        />
        Excluded First
      </label>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Duration</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="option in durationOptions">
        <label
          :key="option.value"
          :for="option.value"
          :class="{ active: durationFilters.includes(option.value) }"
          class="chip"
        >
          <input
            type="checkbox"
            :name="option.value"
            :id="option.value"
            :value="option.value"
            v-model="durationFilters"
            hidden
          />
          {{ option.label }}
        </label>
      </template>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Provider</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="provider in collectiveProviders">
        <label
          :key="provider.provider_id"
          :for="provider.provider_name"
          :class="{ active: serviceFilters.includes(provider.provider_name) }"
          class="chip"
        >
          <input
            type="checkbox"
            :name="provider.provider_name"
            :id="provider.provider_name"
            :value="provider.provider_name"
            v-model="serviceFilters"
            hidden
          />
          {{ provider.provider_name }}
        </label>
      </template>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Genres</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="genre in collectiveGenres">
        <label
          :key="genre.id"
          :for="genre.id"
          :class="{ active: genreFilters.includes(genre.name) }"
          class="chip"
        >
          <input
            type="checkbox"
            :name="genre.id"
            :id="genre.id"
            :value="genre.name"
            v-model="genreFilters"
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
import placeholders from "@/placeholders";
import { TMDBGenre, TMDBStreamProvider } from "@/types/tmdb";
import IMovie from "@/types/interface/IMovie";

@Component
export default class DrawerFilter extends Vue {
  sortOrder = [
    { label: "ABC", value: "alpha" },
    { label: "By Shortest", value: "duration_asc" },
    { label: "By Longest", value: "duration_desc" },
    { label: "By Service", value: "service_abc" },
  ];

  durationOptions = [
    { label: "Short", value: "short" },
    { label: "Long", value: "long" },
    { label: "Real Long", value: "realLong" },
  ];

  placeholders = placeholders;

  get collectiveProviders(): TMDBStreamProvider[] {
    const _presentProviders: TMDBStreamProvider[] = [];
    this.$store.getters.getMoviesToWatch.forEach((movie: IMovie) => {
      if (movie.providers.length) {
        if (
          !_presentProviders.find(
            (provider) =>
              provider.provider_id === movie.providers[0].provider_id
          )
        ) {
          _presentProviders.push(movie.providers[0]);
        }
      }
    });
    return _presentProviders;
  }

  get collectiveGenres(): TMDBGenre[] {
    const _presentGenres: TMDBGenre[] = [];
    this.$store.getters.getMoviesToWatch.forEach((movie) => {
      movie.genres.forEach((genre) => {
        if (!_presentGenres.find((pGenre) => pGenre.id === genre.id)) {
          _presentGenres.push(genre);
        }
      });
    });
    return _presentGenres.sort(this.sortGenres);
  }

  get orderFilter(): string {
    return this.$store.getters.getOrderFilter;
  }

  set orderFilter(value: string) {
    this.$store.commit("setOrderFilter", value);
  }

  get excludeFilter(): string {
    return this.$store.getters.getExcludeFilter;
  }

  set excludeFilter(value: string) {
    this.$store.commit("setExcludeFilter", value);
  }

  get durationFilters(): Array<string> {
    return this.$store.getters.getDurationFilters;
  }

  set durationFilters(value: Array<string>) {
    this.$store.commit("setDurationFilters", value);
  }

  get serviceFilters(): Array<string> {
    return this.$store.getters.getServiceFilters;
  }

  set serviceFilters(value: Array<string>) {
    this.$store.commit("setServiceFilters", value);
  }

  get genreFilters(): Array<string> {
    return this.$store.getters.getGenreFilters;
  }

  set genreFilters(value: Array<string>) {
    this.$store.commit("setGenreFilters", value);
  }

  get activeFilters(): number {
    let count = 0;
    if (this.$store.getters.getOrderFilter !== "") count++;
    if (this.$store.getters.getExcludeFilter !== "") count++;
    if (this.$store.getters.getDurationFilters.length) count++;
    if (this.$store.getters.getServiceFilters.length) count++;
    if (this.$store.getters.getGenreFilters.length) count++;
    return count;
  }

  uncheckRadio(e, type): void {
    if (e.currentTarget.classList.contains("active")) {
      e.currentTarget.lastElementChild.checked = false;
      this[`${type}Filter`] = "";
      e.preventDefault();
    }
  }

  closeDrawer(): void {
    this.$emit("closeDrawer");
  }

  sortGenres(genre1: TMDBGenre, genre2: TMDBGenre): number {
    if (genre1.name > genre2.name) return 1;
    else if (genre1.name < genre2.name) return -1;
    else return 0;
  }
}
</script>
