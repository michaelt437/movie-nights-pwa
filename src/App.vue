<template>
  <div id="app" class="pb-5 px-5" style="margin-top: 56px;">
    <app-header
      :isSignedIn.sync="isSignedIn"
      :photoUrl="loggedInUser.photoURL"
      :titleBgSolid="titleBgSolid"
    />
    <app-paralax-background />
    <app-title />
    <div v-if="loading" class="loading flex justify-center mt-24">
      <i class="fas fa-circle-notch fa-spin text-teal-400 text-5xl"></i>
    </div>
    <router-view v-else @scrolling="handleScroll" @popup="invokePopup" @drawer="invokeDrawer" />
    <app-footer @popup="invokePopup" />
    <popup-base v-if="popUpComponent !== null">
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
    <drawer-base v-if="drawerComponent !== null">
      <keep-alive>
        <component
          :is="drawerComponent"
          @closeDrawer="closeDrawer" />
      </keep-alive>
    </drawer-base>
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
import DrawerBase from "@/components/DrawerBase.vue";
import DrawerFilter from "@/components/DrawerFilter.vue";
import DrawerPickFilter from "@/components/DrawerPickFilter.vue";
import IUser from "@/interface/IUser";
import IMovie from "./interface/IMovie";
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
    PopupConfirm,
    DrawerBase,
    DrawerFilter,
    DrawerPickFilter
  }
})
export default class App extends Vue {
  titleBgSolid = false;
  loggedInUser = { email: "" };
  isSignedIn = false;
  users: Array<IUser> = [];
  popUpComponent = null;
  drawerComponent = null;
  propMovie = {};
  propMessage = "";
  moviesList: Array<IMovie> = [];
  propAction = "";
  loading = true;

  handleScroll (bool): void {
    this.titleBgSolid = bool;
  }

  async init (): Promise<void> {
    await db.collection("users").where("email", "==", this.loggedInUser.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(user => {
          this.$store.commit("setCurrentUser", user.data());
          this.$store.commit("setCurrentUserDocumentId", user.id);
        });
      });
  }

  invokePopup (name, props?, message?, action?): void {
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

  async fetchMoviesList (): Promise<any> {
    await db.collection(this.$store.getters.getCurrentUserDocumentId)
      .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const movieObj = change.doc.data();
            movieObj.documentId = change.doc.id;
            this.moviesList.push(movieObj as IMovie);
          }
        });
      });
  }

  async checkForTonightsPick (): Promise<any> {
    await db.collection("tonightsPick")
      .doc("movie")
      .get()
      .then(doc => {
        if (doc.data() !== undefined) {
          this.$store.commit("updateRollPermission", false);
          this.$store.commit("setTonightsPick", doc.data());
        } else {
          this.$store.commit("updateRollPermission", true);
          this.$store.commit("setTonightsPick", null);
        }
      });
  }

  invokeDrawer (name): void {
    document.querySelector("body")!.classList.add("noscroll");
    this.drawerComponent = name;
  }

  closeDrawer (): void {
    document.querySelector("body")!.classList.remove("noscroll");
    this.drawerComponent = null;
  }

  checkFirebaseAuthState (): Promise<boolean> {
    return new Promise(resolve => {
      fb.auth().onAuthStateChanged((user: any | null) => {
        if (user) {
          this.loggedInUser = Object.assign({}, this.loggedInUser, user.providerData[0]);
          this.isSignedIn = true;
          resolve(true);
        } else {
          this.isSignedIn = false;
          resolve(false);
        }
      });
    });
  }

  resetRollCheck (): void {
    if (this.$store.getters.getTonightsPick) {
      const lastPickTime = this.$store.getters.getTonightsPick.watchDate;

      if (this.$moment().valueOf() > this.$moment(lastPickTime).add(2, "minutes").valueOf()) {
        this.$store.commit("resetRolls");
        this.$store.commit("updateUserHasRolled", false);
        this.$store.commit("setTonightsPick", null);
        this.$store.commit("updateRollPermission", true);

        db.collection("tonightsPick")
          .doc("movie")
          .delete();

        db.collection("users")
          .doc(this.$store.getters.getCurrentUserDocumentId)
          .update({
            hasPicked: false,
            hasRolled: false,
            rolls: 4000
          });
      }
    }
  }

  // Lifecycle Hooks
  async created () {
    await this.checkFirebaseAuthState();
    await this.init();
    await this.fetchMoviesList();
    await this.checkForTonightsPick();
    this.resetRollCheck();
    this.loading = false;
    this.$store.commit("setMoviesList", this.moviesList);

    window.addEventListener("scroll", (): void => {
      // header bg
      const titleRect = document.querySelector(".app-title")!.getBoundingClientRect();
      this.titleBgSolid = titleRect.bottom < 0;
    });
    console.log("base url", process.env.BASE_URL);
  }
}
</script>
