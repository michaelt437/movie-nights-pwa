<template>
  <div class="px-5 py-3">
    <div class="flex text-gray-500 justify-between items-center mb-6">
      <h2 class="text-4xl"><span v-show="activeFilters">{{ activeFilters }}</span> Filter<span v-show="activeFilters > 1">s</span></h2>
      <i class="fas fa-times" @click="closeDrawer"></i>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Order</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="option in sortOrder">
        <label
          :key="option.value"
          :for="option.value"
          :class="{ 'active' : orderFilter.includes(option.value)}"
          class="chip rounded-full"
          @click.stop="uncheckRadio($event, 'order')"
          >
            <input type="radio" :name="option.value" :id="option.value" :value="option.value" v-model="orderFilter" hidden>
            {{ option.label }}
        </label>
      </template>
    </div>
    <div class="chip-group flex-wrap mb-5">
      <label
        for="availFirst"
        :class="{ 'active' : excludeFilter === 'available'}"
        class="chip rounded-full"
        @click.stop="uncheckRadio($event, 'exclude')">
        <input type="radio" name="availFirst" id="availFirst" value="available" v-model="excludeFilter" hidden>
        Available First
      </label>
      <label
        for="excludeFirst"
        :class="{ 'active' : excludeFilter === 'exclude'}"
        class="chip rounded-full"
        @click.stop="uncheckRadio($event, 'exclude')">
        <input type="radio" name="excludeFirst" id="excludeFirst" value="exclude" v-model="excludeFilter" hidden>
        Excluded First
      </label>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Duration</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="option in durationOptions">
        <label
          :key="option.value"
          :for="option.value"
          :class="{ 'active' : durationFilters.includes(option.value)}"
          class="chip"
          >
            <input type="checkbox" :name="option.value" :id="option.value" :value="option.value" v-model="durationFilters" hidden>
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
          :class="{ 'active' : serviceFilters.includes(service.value)}"
          class="chip"
          >
            <input type="checkbox" :name="service.value" :id="service.value" :value="service.value" v-model="serviceFilters" hidden>
            {{ service.title }}
        </label>
      </template>
    </div>
    <p class="text-xl text-gray-800 mb-2"><strong>Genres</strong></p>
    <div class="chip-group flex-wrap mb-5">
      <template v-for="genre in placeholders.genres">
        <label
          :key="genre.value"
          :for="genre.value"
          :class="{ 'active' : genreFilters.includes(genre.value) }"
          class="chip"
          >
            <input type="checkbox" :name="genre.value" :id="genre.value" :value="genre.value" v-model="genreFilters" hidden>
            {{ genre.title }}
        </label>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import placeholders from "@/placeholders";

@Component
export default class DrawerFilter extends Vue {
  sortOrder = [
    { label: "ABC", value: "alpha" },
    { label: "By Shortest", value: "duration_asc" },
    { label: "By Longest", value: "duration_desc" },
    { label: "By Service", value: "service_abc" }
  ];

  durationOptions = [
    { label: "Short", value: "short" },
    { label: "Long", value: "long" },
    { label: "Real Long", value: "realLong" }
  ];

  placeholders = placeholders;

  get streamingService (): Array<object> {
    return placeholders.streamingService;
  }

  get orderFilter (): string {
    return this.$store.getters.getOrderFilter;
  }

  set orderFilter (value: string) {
    this.$store.commit("setOrderFilter", value);
  }

  get excludeFilter (): string {
    return this.$store.getters.getExcludeFilter;
  }

  set excludeFilter (value: string) {
    this.$store.commit("setExcludeFilter", value);
  }

  get durationFilters (): Array<string> {
    return this.$store.getters.getDurationFilters;
  }

  set durationFilters (value: Array<string>) {
    this.$store.commit("setDurationFilters", value);
  }

  get serviceFilters (): Array<string> {
    return this.$store.getters.getServiceFilters;
  }

  set serviceFilters (value: Array<string>) {
    this.$store.commit("setServiceFilters", value);
  }

  get genreFilters (): Array<string> {
    return this.$store.getters.getGenreFilters;
  }

  set genreFilters (value: Array<string>) {
    this.$store.commit("setGenreFilters", value);
  }

  get activeFilters (): number {
    let count = 0;
    if (this.$store.getters.getOrderFilter !== "") count++;
    if (this.$store.getters.getExcludeFilter !== "") count++;
    if (this.$store.getters.getDurationFilters.length) count++;
    if (this.$store.getters.getServiceFilters.length) count++;
    if (this.$store.getters.getGenreFilters.length) count++;
    return count;
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
