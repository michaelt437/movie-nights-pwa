<template>
  <div class="footer flex fixed bottom-0 left-0 w-full items-center bg-gray-900 z-10">
    <router-link
      v-for="link in links"
      :title="link.name"
      :key="link.name"
      :to="{ name: link.name }"
      :class="{ 'text-teal-500' : $route.name === link.name }"
      class="text-center text-gray-200 py-4 flex-grow">
      <i :class="`fas fa-${link.icon} text-xl`"></i>
    </router-link>
    <div v-if="isDevelopment" class="text-center text-gray-700 py-4 flex-grow relative">
      <i class="fas fa-history text-xl"></i>
    </div>
    <span class="text-center text-green-500 py-4 flex-grow" @click="addMovie">
      <i class="fas fa-plus-circle text-xl"></i>
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IUser from "@/interface/IUser";

@Component
export default class AppFooter extends Vue {
  links = [
    {
      name: "Home",
      icon: "home"
    },
    {
      name: "Movie Pool",
      icon: "list"
    }
  ]

  get isDevelopment (): boolean {
    return process.env.NODE_ENV === "development";
  }

  addMovie (): void {
    this.$emit("popup", "PopupAddMovie");
  }

  create () {
    console.log("mode: ", process.env.NODE_ENV);
  }
}
</script>
