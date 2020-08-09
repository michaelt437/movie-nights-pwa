<template>
  <div class="footer flex fixed bottom-0 left-0 w-full items-center bg-gray-900 z-10">
    <router-link
      v-for="link in links"
      :key="link.name"
      :to="{ name: link.name }"
      :class="{ 'text-teal-500' : $route.name === link.name }"
      class="text-center text-gray-200 py-4 flex-grow">
      <i :class="`fas fa-${link.icon} text-xl`"></i>
    </router-link>
    <div class="text-center text-gray-200 py-4 flex-grow relative">
      <i class="fas fa-history text-xl"></i>
      <!-- <div class="rounded-sm py-1 absolute w-auto text-gray-700 bg-white" style="bottom: 100%;">
        <div v-for="user in users" :key="user.name" class="text-left py-1 px-4 hover:bg-gray-200 capitalize whitespace-no-wrap">
          {{ user.name }}
        </div>
      </div> -->
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

  get users (): Array<IUser> {
    return this.$store.getters.getUsers.filter(user => user.name !== this.$store.getters.getCurrentUser.name);
  }

  addMovie (): void {
    this.$emit("popup", "PopupAddMovie");
  }
}
</script>
