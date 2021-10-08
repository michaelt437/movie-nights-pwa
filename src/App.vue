<template>
  <div id="app" class="pb-5 px-5 relative" style="margin-top: 56px;">
    <app-header
      :isSignedIn.sync="isSignedIn"
      :photoUrl="loggedInUser.photoURL"
      :titleBgSolid="titleBgSolid"
    />
    <app-paralax-background class="md:hidden" />
    <app-title />
    <div v-if="isSignedIn" class="loading flex justify-center mt-24">
      <template v-if="loading">
        <i class="fas fa-circle-notch fa-spin text-green-400 text-5xl"></i>
      </template>
      <router-view
        v-else
        @scrolling="handleScroll"
        @popup="invokePopup"
        @drawer="invokeDrawer"
      />
    </div>
    <div v-else class="loading flex justify-center mt-24">
      <button
        class="rounded-full bg-pink-600 py-5 text-white w-2/4"
        @click="login"
      >
        Log In
      </button>
    </div>
    <app-footer @popup="invokePopup" />
    <popup-base v-if="popUpComponent !== null">
      <component
        :is="popUpComponent"
        v-bind="{
          movie: propMovie,
          message: propMessage,
          action: propAction,
          postAction: propPostAction
        }"
        @closePopup="closePopup"
        @toaster="invokeToaster"
      />
    </popup-base>
    <drawer-base v-if="drawerComponent !== null">
      <keep-alive>
        <component :is="drawerComponent" @closeDrawer="closeDrawer" />
      </keep-alive>
    </drawer-base>
    <div
      class="toaster bg-green-500 text-gray-200 rounded-md px-5 py-3 w-11/12 fixed bottom-0 z-20"
      :class="{ active: toaster }"
    >
      {{ toasterText }}
    </div>
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
import { db, fb, auth } from "@/db";

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
  propPostAction = "";
  moviesList: Array<IMovie> = [];
  propAction = "";
  loading = true;
  toaster = false;
  toasterText = "";

  handleScroll (bool): void {
    this.titleBgSolid = bool;
  }

  login (): void {
    const provider = new auth.GoogleAuthProvider();
    fb.auth()
      .signInWithRedirect(provider)
      .then(response => {
        console.log("logged in", response);
        this.$emit("update:isSignedIn", true);
      })
      .catch(error => {
        console.error("Authentication error: ", error);
      });
  }

  async init (): Promise<void> {
    await db
      .collection("users")
      .where("email", "==", this.loggedInUser.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(user => {
          this.$store.commit("setCurrentUser", user.data());
          this.$store.commit("setCurrentUserDocumentId", user.id);
        });
      });
  }

  invokePopup (name, props?, message?, action?, postAction?): void {
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
    if (postAction) {
      this.propPostAction = postAction;
    }
  }

  invokeToaster (text): void {
    this.toaster = true;
    this.toasterText = text;
    setTimeout(() => {
      this.toaster = false;
      this.toasterText = "";
    }, 5000);
  }

  closePopup (): void {
    this.popUpComponent = null;
    document.querySelector("body")!.classList.remove("noscroll");
  }

  async fetchMoviesList (): Promise<any> {
    await db
      .collection(this.$store.getters.getCurrentUserDocumentId)
      .onSnapshot({ includeMetadataChanges: true }, querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            const movieObj = change.doc.data();
            movieObj.documentId = change.doc.id;
            this.moviesList.push(movieObj as IMovie);
          }
        });
      });
  }

  async checkForTonightsPick (): Promise<any> {
    await db
      .collection("tonightsPick")
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
          this.loggedInUser = Object.assign(
            {},
            this.loggedInUser,
            user.providerData[0]
          );
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

      if (
        this.$moment().valueOf() >
        this.$moment(lastPickTime)
          .add(1, "days")
          .hours(6)
          .valueOf()
      ) {
        this.$store.commit("resetRolls");
        this.$store.commit("updateUserHasRolled", false);
        this.$store.commit("setTonightsPick", null);
        this.$store.commit("updateRollPermission", true);

        db.collection("tonightsPick")
          .doc("movie")
          .delete();
      }
    }

    db.collection("users")
      .doc(this.$store.getters.getCurrentUserDocumentId)
      .update({
        hasPicked: false,
        hasRolled: false,
        rolls: 4
      });
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
      const titleRect = document
        .querySelector(".app-title")!
        .getBoundingClientRect();
      this.titleBgSolid = titleRect.bottom < 0;
    });
  }
}
</script>
<style lang="scss">
.toaster {
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease-in-out;

  &.active {
    opacity: 1;
    transform: translateY(-50%);
  }
}
</style>
