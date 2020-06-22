<template>
  <div id="app">
    <app-header
    :isSignedIn.sync="isSignedIn"
    :photoUrl="loggedInUser.photoURL"
    :titleBgSolid="titleBgSolid"
    ></app-header>
    <router-view @scrolling="handleScroll" />
    <app-footer @addMovie="invokePopup"></app-footer>
    <popup-base v-if="popUpComponent != null">
      <component :is="popUpComponent" @closePopup="closePopup" ></component>
    </popup-base>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import PopupBase from "@/components/PopupBase.vue";
import PopupAddMovie from "@/components/PopupAddMovie.vue";
import PopupConfirm from "@/components/PopupConfirm.vue";
import IUser from "@/interface/IUser";
import { db, fb } from "@/db";

@Component({
  components: {
    AppHeader,
    AppFooter,
    PopupBase,
    PopupAddMovie,
    PopupConfirm
  }
})
export default class App extends Vue {
  titleBgSolid = false;
  loggedInUser = {};
  isSignedIn = false;
  users: Array<IUser> = [];
  popUpComponent = null;

  handleScroll (bool): void {
    this.titleBgSolid = bool;
  }

  init (): void {
    db.collection("users")
      .onSnapshot((doc) => {
        doc.docChanges().forEach(change => {
          const doc = change.doc;
          console.log("printing doc", doc.data());
        // let _user: User = new User();
        // this.users.push(_user);
        });
      });
  }

  invokePopup (name): void {
    this.popUpComponent = name;
    document.querySelector("body")!.classList.add("noscroll");
  }

  closePopup (): void {
    this.popUpComponent = null;
    document.querySelector("body")!.classList.remove("noscroll");
  }

  // Lifecycle Hooks
  created () {
    this.init();
    fb.auth().onAuthStateChanged((user: any | null) => {
      if (user) {
        this.loggedInUser = user.providerData[0];
        this.isSignedIn = true;
      } else {
        this.isSignedIn = false;
      }
    });
  }
}
</script>
