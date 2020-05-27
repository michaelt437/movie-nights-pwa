<template>
  <div id="app" class="pb-5 px-5" style="margin-top: 56px;">

    <div class="fixed left-0 h-64" style="z-index: -1;" :style="paralaxValue">
      <img class="hero inline" src="./assets/hero.jpg" alt="">
    </div>

    <!-- Header -->
    <div
    class="header flex justify-between fixed top-0 left-0 w-full items-center py-2 px-5 overflow-hidden"
    :class="{'bg-solid' : titleBgSolid}">
      <span class="text-gray-200 font-bold header-app-title title-styled">Nightly Roulette</span>
      <span
      v-if="signedIn"
      class="avatar rounded-full overflow-hidden bg-indigo-800 w-8" @click="logOut">
        <img :src="photo" alt="photo">
      </span>
      <button v-else class="btn btn-pink-600 text-sm text-white" @click="login">Log In</button>
    </div>

    <!-- Footer -->
    <div class="footer flex fixed bottom-0 left-0 w-full items-center py-4 bg-gray-900 z-10">
      <span class="text-center text-teal-500 flex-grow">
        <i class="fas fa-home text-xl"></i>
      </span>
      <span class="text-center text-gray-200 flex-grow">
        <i class="fas fa-list text-xl"></i>
      </span>
      <span class="text-center text-gray-200 flex-grow">
        <i class="fas fa-user-friends text-xl"></i>
      </span>
      <span class="text-center text-green-500 flex-grow">
        <i class="fas fa-plus-circle text-xl"></i>
      </span>
    </div>

    <!-- Title -->
    <div class="flex items-center text-center justify-center" style="height: 24rem;">
      <h1 class="text-gray-800 uppercase app-title title-styled leading-tight">
        <span class="text-3xl">Nightly</span>
        <br>
        <span class="text-5xl font-bold">Roulette</span>
      </h1>
    </div>
    <p class="my-4 text-white">Signed in status: {{ signedIn }}</p>

    <!-- Tabs -->
    <!-- <div class="tabs mb-8 sticky" style="top: 55px;">
      <div class="tab active" style="flex-basis: 50%;">Movies</div>
      <div class="tab" style="flex-basis: 50%;">TV</div>
    </div> -->
    <!-- <div class="btn-group mb-16">
      <button class="btn btn-orange-500 text-white">Movies List</button>
      <button class="btn btn-gray-200 outline text-gray-200">TV List</button>
    </div> -->

    <!-- Filters -->
    <!-- <div class="btn-group mb-2">
      <button class="btn btn-teal-500 outline text-white">Time <i class="fas fa-caret-down ml-1"></i></button>
      <button class="btn btn-teal-500 outline text-white">Service <i class="fas fa-caret-down ml-1"></i></button>
    </div> -->

    <!-- Rolling Card -->
    <div v-if="isPicking" class="movie-card rounded-lg bg-indigo-600 text-gray-200 px-5 py-3 mb-4">
      <div class="movie-card__title text-2xl">Annihilation</div>
      <div class="movie-card__service text-green-300 text-lg my-2">Hulu</div>
      <div class="movie-card__duration text-sm mb-5">119 minutes</div>
      <div class="movie-card__footer">
        <div class="btn-group flex">
          <button class="btn btn-orange-600 flex-grow" @click="isPicking = false">
            <i class="fas fa-times"></i>
          </button>
          <button class="btn btn-gray-500 flex-grow">
            <i class="fas fa-dice"></i>
          </button>
          <button class="btn btn-teal-500 flex-grow" style="flex-basis: 35%">
            <i class="fas fa-check"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Dice Card -->
    <div v-else class="movie-card rounded-lg btn-indigo-600 text-center text-gray-200 py-8 mb-4 cursor-pointer" @click="isPicking = true">
      <div class="text-2xl">What's the pick?</div>
    </div>

    <!-- Picked Card -->
    <div class="movie-card rounded-lg bg-gray-800 text-gray-200 px-5 py-3 mb-4">
      <div class="movie-card__title text-2xl">The Neon Demon</div>
      <div class="movie-card__service text-blue-400 text-md my-2">Amazon Prime</div>
      <div class="movie-card__duration text-sm">117 minutes</div>
      <div class="movie-card__footer">
      </div>
    </div>

    <!-- Picked cards -->
    <div v-for="n in picks" :key="n" class="movie-card rounded-lg bg-gray-800 text-gray-200 px-5 py-3 mb-4">
      <div class="movie-card__title text-2xl">{{ n.title }}</div>
      <div class="movie-card__service text-red-700 text-md my-2" :class="n.platform.code">{{ n.platform.name }}</div>
      <div class="movie-card__duration text-sm">{{ n.time }} minutes</div>
      <div class="movie-card__footer">
      </div>
    </div>

    <div class="pt-4 py-16 text-gray-600 text-center">Your beginning...</div>
    <!-- Add a Movie Card -->
    <!-- <div class="movie-card rounded-lg bg-indigo-500 text-gray-200 px-5 pb-3 mb-4">
      <p class="text-2xl text-center py-5">Add a movie</p>
      <label for="movie-title" class="text-sm">Movie Title</label>
      <div class="input">
        <input type="text" name="movie-title" id="" placeholder="Rambo: Last Blood">
      </div>
      <label for="movie-title" class="text-sm">Duration</label>
      <div class="input">
        <input type="text" name="movie-title" id="" placeholder="90">
      </div>
      <label for="movie-title" class="text-sm">Streaming Service</label>
      <select name="" id="">
        <option value="1channel">1channel.rus</option>
      </select>
      <div class="btn-group flex">
        <span class="ml-auto"></span>
        <button class="btn btn-white outline" style="flex-basis: 30%;">
          <i class="fas fa-times"></i>
        </button>
        <button class="btn btn-teal-400 disabled" style="flex-basis: 30%;">
          <i class="fas fa-check"></i>
        </button>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import { db, fb, auth } from "@/db";
import IUser from "./interface/IUser";
import User from "./class/User";

@Component({
  components: {
    HelloWorld
  }
})
export default class App extends Vue {
  // Fields
  private name = "";
  private email = "";
  private photo = "";
  public signedIn = false;
  public users: User[] = [];
  private paralaxOffset = 0;
  public titleBgSolid = false;
  public isPicking = false;
  public picks: Array<object> = [
    {
      title: "Annihilation",
      platform: {
        name: "Hulu",
        code: "hulu"
      },
      time: 119
    },
    {
      title: "Blade Runner 2049",
      platform: {
        name: "Netflix",
        code: "netflix"
      },
      time: 145
    },
    {
      title: "The Lighthouse",
      platform: {
        name: "Amazon Prime",
        code: "amazon"
      },
      time: 92
    },
    {
      title: "The Martian",
      platform: {
        name: "DVD/Bluray",
        code: "disc"
      },
      time: 132
    }
  ];

  // Properties
  get paralaxValue () {
    return {
      top: `-${this.paralaxOffset * 0.5}px`
    };
  }

  get hasAvatarStyles () {
    return "w-8";
  }

  get logInBtnStyles () {
    return "px-4 text-white";
  }

  // Methods
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

  login (): void {
    const provider = new auth.GoogleAuthProvider();
    // fb.auth().signInWithRedirect(provider)
    fb.auth().signInWithRedirect(provider)
      .then(response => {
        console.log(response);
        this.signedIn = true;
      })
      .catch((error) => {
        console.error("Authentication error: ", error);
      });
  }

  logOut (): void {
    fb.auth().signOut();
    this.signedIn = false;
    window.location.reload();
  }

  // Lifecycle Hooks
  created () {
    window.addEventListener("scroll", (): void => {
      // paralax calc
      const scrolled = window.pageYOffset;
      this.paralaxOffset = scrolled;

      // header bg
      const titleRect = document.querySelector(".app-title")?.getBoundingClientRect();
      this.titleBgSolid = titleRect!.bottom < 0;
      console.log(this.titleBgSolid);
    });
    this.init();
    fb.auth().onAuthStateChanged((user: any | null) => {
      if (user) {
        console.log("user: ", user.providerData);
        this.photo = user.providerData[0].photoURL;
        this.signedIn = true;
      } else {
        this.signedIn = false;
      }
    });
  }
}
</script>
