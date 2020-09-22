<template>
  <div class="px-5 py-3">
    <div class="flex text-gray-500 justify-between items-center mb-6">
      <h2 class="text-4xl">Categories: {{ pickCategories }}</h2>
      <i class="fas fa-times" @click="closeDrawer"></i>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Duration</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="option in durationOptions">
        <label
          :key="option.value"
          :for="option.value"
          :class="{ 'active' : durationCategories.includes(option.value)}"
          class="chip"
          >
            <input type="checkbox" :name="option.value" :id="option.value" :value="option.value" v-model="durationCategories" hidden>
            {{ option.label }}
        </label>
      </template>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Service</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="service in streamingService">
        <label
          :key="service.value"
          :for="service.value"
          :class="{ 'active' : serviceCategories.includes(service.value)}"
          class="chip"
          >
            <input type="checkbox" :name="service.value" :id="service.value" :value="service.value" v-model="serviceCategories" hidden>
            {{ service.title }}
        </label>
      </template>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Genres</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="genre in availableGenres">
        <label
          :key="genre.value"
          :for="genre.value"
          :class="{ 'active' : genreCategories.includes(genre.value) }"
          class="chip"
          >
            <input type="checkbox" :name="genre.value" :id="genre.value" :value="genre.value" v-model="genreCategories" hidden>
            {{ genre.title }}
        </label>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IService from "@/interface/IService";
import IGenre from "@/interface/IGenre";
import placeholders from "@/placeholders";

@Component
export default class DrawerPickFilter extends Vue {
  durationOptions = [
    { label: "Short", value: "short" },
    { label: "Long", value: "long" },
    { label: "Real Long", value: "realLong" }
  ];

  get streamingService (): Array<object> {
    const availableServices: Array<IService> = [];
    this.$store.getters.getMoviesToWatch.forEach(movie => {
      if (!movie.exclude) {
        if (!availableServices.find(service => service.title === movie.service.title)) {
          availableServices.push(movie.service);
        }
      }
    });
    return availableServices;
  }

  get availableGenres (): Array<IGenre> {
    const availableGenres: Array<IGenre> = [];
    this.$store.getters.getMoviesToWatch.forEach(movie => {
      if (!movie.exclude) {
        movie.genres.forEach(genre => {
          if (!availableGenres.find(genreValue => genreValue.value === genre.value)) {
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
