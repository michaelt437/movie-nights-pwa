<template>
  <div
  class="header flex fixed top-0 left-0 w-full justify-between items-center py-2 px-5 overflow-hidden z-10"
  :class="{'bg-solid' : titleBgSolid}">
    <router-link :to="{ name: 'Home' }">
      <i
        class="fas fa-chevron-left mr-2"
        :class="$route.name === 'Home' ? 'text-transparent pointer-events-none' : 'text-white'"
      ></i>
    </router-link>
    <span class="text-gray-200 font-bold header-app-title title-styled mb-1">Movie Nights</span>
    <span
    v-if="isSignedIn"
    class="avatar rounded-full overflow-hidden bg-indigo-800 w-8" @click="logout">
      <img :src="photoUrl" alt="photo">
    </span>
    <button v-else class="btn btn-pink-600 text-sm text-white" @click="login">Log In</button>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { auth, fb } from "../db";

@Component
export default class AppHeader extends Vue {
  @Prop(Boolean) readonly titleBgSolid!: boolean;
  @Prop(Boolean) readonly isSignedIn!: boolean;
  @Prop(String) readonly photoUrl!: string;

  login (): void {
    const provider = new auth.GoogleAuthProvider();
    fb.auth().signInWithRedirect(provider)
      .then(response => {
        console.log(response);
        this.$emit("update:isSignedIn", true);
      })
      .catch((error) => {
        console.error("Authentication error: ", error);
      });
  }

  logout (): void {
    fb.auth().signOut();
    this.$emit("update:isSignedIn", false);
    window.location.reload();
  }
}
</script>
