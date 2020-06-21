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
      <span class="text-center text-gray-200 py-4 flex-grow">
        <i class="fas fa-user-friends text-xl"></i>
      </span>
      <span class="text-center text-green-500 py-4 flex-grow">
        <i class="fas fa-plus-circle text-xl"></i>
      </span>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

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
}
</script>
