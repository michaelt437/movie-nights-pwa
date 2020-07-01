<template>
  <div id="app" class="pb-5 px-5" style="margin-top: 56px;">
    <app-header
      :isSignedIn.sync="isSignedIn"
      :photoUrl="loggedInUser.photoURL"
      :titleBgSolid="titleBgSolid"
    />
    <app-paralax-background />
    <app-title />
    <router-view @scrolling="handleScroll" @popup="invokePopup" />
    <app-footer @popup="invokePopup" />
    <popup-base v-if="popUpComponent != null">
      <component
        :is="popUpComponent"
        v-bind="{
          movie: propMovie,
          message: propMessage,
          action: propAction
         }"
        @closePopup="closePopup"
      />
    </popup-base>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import AppHeader from "@/components/AppHeader.vue";
import AppParalaxBackground from "@/components/AppParalaxBackground.vue";
import AppTitle from "@/components/AppTitle.vue";
import AppFooter from "@/components/AppFooter.vue";
import PopupBase from "@/components/PopupBase.vue";
import PopupAddMovie from "@/components/PopupAddMovie.vue";
import PopupEditMovie from "@/components/PopupEditMovie.vue";
import PopupConfirm from "@/components/PopupConfirm.vue";
import IUser from "@/interface/IUser";
import { db, fb } from "@/db";

@Component({
  components: {
    AppHeader,
    AppParalaxBackground,
    AppTitle,
    AppFooter,
    PopupBase,
    PopupAddMovie,
    PopupEditMovie,
    PopupConfirm
  }
})
export default class App extends Vue {
  titleBgSolid = false;
  loggedInUser = {};
  isSignedIn = false;
  users: Array<IUser> = [];
  popUpComponent = null;
  propMovie = {};
  propMessage = "";
  propAction = "";

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

  invokePopup (name, props?, message?, action?): void {
    console.log("props", props, message);
    this.popUpComponent = name;
    document.querySelector("body")!.classList.add("noscroll");
    if (props) {
      this.propMovie = props;
    }
    if (message) {
      this.propMessage = message;
    }
    if (action) {
      this.propAction = action;
    }
  }

  closePopup (): void {
    this.popUpComponent = null;
    document.querySelector("body")!.classList.remove("noscroll");
  }

  // Lifecycle Hooks
  mounted () {
    this.init();
    fb.auth().onAuthStateChanged((user: any | null) => {
      if (user) {
        this.loggedInUser = user.providerData[0];
        this.isSignedIn = true;
      } else {
        this.isSignedIn = false;
      }
    });
    window.addEventListener("scroll", (): void => {
      // header bg
      const titleRect = document.querySelector(".app-title")!.getBoundingClientRect();
      this.titleBgSolid = titleRect.bottom < 0;
    });
  }
}
</script>
