<template>
  <div
  class="header flex fixed top-0 left-0 w-full justify-between items-center py-2 px-5 z-10"
  :class="{'bg-solid' : titleBgSolid}">
    <router-link :to="{ name: 'Home' }">
      <i
        class="fas fa-chevron-left mr-2"
        :class="$route.name === 'Home' ? 'text-transparent pointer-events-none' : 'text-white'"
      ></i>
    </router-link>
    <span class="text-gray-200 font-bold header-app-title title-styled mb-1">Movie Nights</span>
    <div
    v-if="isSignedIn"
    class="avatar w-8 relative">
      <div class="rounded-full overflow-hidden">
        <img :src="photoUrl" alt="photo" @click.stop="showMenu = !showMenu">
      </div>
      <transition name="scale">
        <div
          v-show="showMenu"
         class="avatar__menu rounded-sm py-1 absolute right-0 w-32 z-20 bg-white mt-2 origin-top-right">
          <div class="py-1 px-4 hover:bg-gray-200" @click.stop="logout">Log Out</div>
        </div>
      </transition>
    </div>
    <!-- <button v-else class="btn btn-pink-600 text-sm text-white" @click="login">Log In</button> -->
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

  public showMenu = false;

  login (): void {
    const provider = new auth.GoogleAuthProvider();
    fb.auth().signInWithRedirect(provider)
      .then(response => {
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

  mounted () {
    document.querySelector("body")!.addEventListener("click", () => {
      this.showMenu = false;
    });
  }
}
</script>
