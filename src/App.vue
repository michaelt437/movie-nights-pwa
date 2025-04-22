<template>
  <div id="app" class="pb-5 px-5 relative" style="margin-top: 56px">
    <app-header
      :isSignedIn.sync="isSignedIn"
      :photoUrl="loggedInUser.photoURL"
      :titleBgSolid="titleBgSolid"
    />
    <app-paralax-background class="md:hidden" />
    <app-title />
    <div class="loading flex justify-center mt-24">
      <template v-if="loading">
        <i class="fas fa-circle-notch fa-spin text-green-400 text-5xl"></i>
      </template>
      <router-view
        v-else
        @scrolling="handleScroll"
        @popup="invokePopup"
        @drawer="invokeDrawer"
        @toaster="invokeToaster"
      />
    </div>
    <app-footer @popup="invokePopup" @drawer="invokeDrawer" />
    <popup-base v-if="popUpComponent !== null">
      <component
        :is="popUpComponent"
        v-bind="{
          popupTitle: propPopupTitle,
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
        <component
          :is="drawerComponent"
          @closeDrawer="closeDrawer"
          @toaster="invokeToaster"
        />
      </keep-alive>
    </drawer-base>
    <div
      class="flex justify-between items-center toaster bg-green-500 text-gray-200 rounded-md px-5 py-3 w-11/12 fixed bottom-0 z-20"
      :class="{ active: toaster }"
    >
      {{ toasterText }}
      <i class="fas fa-times" @click="toaster = false"></i>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect
} from "@firebase/auth";
import AppHeader from "@/components/AppHeader.vue";
import AppParalaxBackground from "@/components/AppParalaxBackground.vue";
import AppTitle from "@/components/AppTitle.vue";
import AppFooter from "@/components/AppFooter.vue";
import PopupBase from "@/components/PopupBase.vue";
import PopupEditMovie from "@/components/PopupEditMovie.vue";
import PopupConfirm from "@/components/PopupConfirm.vue";
import DrawerBase from "@/components/DrawerBase.vue";
import DrawerAddMovie from "@/components/DrawerAddMovie.vue";
import DrawerFilter from "@/components/DrawerFilter.vue";
import DrawerPickFilter from "@/components/DrawerPickFilter.vue";
import IUser from "@/types/interface/IUser";
import IMovie from "@/types/interface/IMovie";
import { app, db, auth } from "@/db";

@Component({
  components: {
    AppHeader,
    AppParalaxBackground,
    AppTitle,
    AppFooter,
    PopupBase,
    PopupEditMovie,
    PopupConfirm,
    DrawerBase,
    DrawerAddMovie,
    DrawerFilter,
    DrawerPickFilter
  }
})
export default class App extends Vue {
  titleBgSolid = false;
  loggedInUser = { email: "" };
  users: Array<IUser> = [];
  popUpComponent = null;
  drawerComponent = null;
  propPopupTitle = "";
  propMovie = {};
  propMessage = "";
  propPostAction = "";
  moviesList: Array<IMovie> = [];
  propAction = "";
  loading = true;
  toaster = false;
  toasterText = "";

  get isSignedIn (): boolean {
    return this.$store.state.signedIn;
  }

  set isSignedIn (payload: boolean) {
    console.log("what", payload);
    this.$store.commit("setLoginStatus", payload);
    window.location.reload();
  }

  handleScroll (bool): void {
    this.titleBgSolid = bool;
  }

  async init (): Promise<void> {
    const users = collection(db, "users");
    const user = query(users, where("email", "==", this.loggedInUser.email));
    const userSnapshot = await getDocs(user);

    userSnapshot.forEach((user) => {
      this.$store.commit("setCurrentUser", user.data());
      this.$store.commit("setCurrentUserDocumentId", user.id);
    });
  }

  invokePopup (name, popupTitle?, props?, message?, action?, postAction?): void {
    this.popUpComponent = name;
    document.querySelector("body")!.classList.add("noscroll");
    if (popupTitle) {
      this.propPopupTitle = popupTitle;
    }
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
    const moviesCollection = collection(
      db,
      this.$store.getters.getCurrentUserDocumentId
    );
    const moviesCollectionQuery = query(moviesCollection);
    const unsubscribe = onSnapshot(moviesCollectionQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const movieObj = change.doc.data();
          movieObj.documentId = change.doc.id;
          this.moviesList.push(movieObj as IMovie);
        }
      });
    });
  }

  async checkForTonightsPick (): Promise<any> {
    const tonightsPick = await getDoc(doc(db, "tonightsPick", "movie"));

    if (tonightsPick) {
      if (tonightsPick.data() !== undefined) {
        this.$store.commit("updateRollPermission", false);
        this.$store.commit("setTonightsPick", tonightsPick.data());
      } else {
        this.$store.commit("updateRollPermission", true);
        this.$store.commit("setTonightsPick", null);
      }
    }
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
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.loggedInUser = Object.assign(
            {},
            this.loggedInUser,
            user.providerData[0]
          );
          this.$store.commit("setLoginStatus", true);
          resolve(true);
        } else {
          this.$store.commit("setLoginStatus", false);
          resolve(false);
        }
      });
    });
  }

  async resetRollCheck (): Promise<void> {
    if (this.$store.getters.getTonightsPick) {
      const lastPickTime = this.$store.getters.getTonightsPick.watchDate;

      if (
        this.$moment().valueOf() >
        this.$moment(lastPickTime).add(1, "days").hours(6).valueOf()
      ) {
        this.$store.commit("resetRolls");
        this.$store.commit("updateUserHasRolled", false);
        this.$store.commit("setTonightsPick", null);
        this.$store.commit("updateRollPermission", true);

        await deleteDoc(doc(db, "tonightsPick", "movie"));
      }
    }

    await updateDoc(
      doc(db, "users", this.$store.getters.getCurrentUserDocumentId),
      {
        hasPicked: false,
        hasRolled: false,
        rolls: 4
      }
    );
  }

  // Lifecycle Hooks
  async created () {
    await this.checkFirebaseAuthState();
    if (this.isSignedIn) {
      await this.init();
      await this.fetchMoviesList();
      await this.checkForTonightsPick();
      this.resetRollCheck();
    }
    await this.$store.dispatch("fetchConfiguration");
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
    transform: translateY(-55px);
  }

  @media (min-width: 768px) {
    width: 300px;
  }
}
</style>
