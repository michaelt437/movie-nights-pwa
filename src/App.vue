<template>
  <div id="app">
    <app-header
    :isSignedIn.sync="isSignedIn"
    :photoUrl="loggedInUser.photoURL"
    :titleBgSolid="titleBgSolid"
    ></app-header>
    <router-view @scrolling="handleScroll" />
    <app-footer></app-footer>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import IUser from "./interface/IUser";
import { db, fb, auth } from "@/db";

@Component({
  components: {
    AppHeader,
    AppFooter
  }
})
export default class App extends Vue {
  titleBgSolid = false;
  loggedInUser = {};
  isSignedIn = false;
  users: Array<IUser> = [];

  handleScroll (bool): void {
    this.titleBgSolid = bool;
  }

  init (): void {
    db.collection("users")
      .onSnapshot((doc) => {
        doc.docChanges().forEach(change => {
          const doc = change.doc;
        // let _user: User = new User();
        // this.users.push(_user);
        });
      });
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
