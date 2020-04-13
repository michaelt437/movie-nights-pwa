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
      <span class="avatar w-8 rounded-full overflow-hidden">
        <img :src="photo" alt="photo">
      </span>
    </div>

    <!-- Footer -->
    <div class="footer flex fixed bottom-0 left-0 w-full items-center py-4 bg-gray-900 z-10">
      <span class="text-center text-gray-200 flex-grow">
        <i class="fas fa-history text-xl"></i>
      </span>
      <span class="text-center text-gray-200 flex-grow">
        <i class="fas fa-list text-xl"></i>
      </span>
      <span class="text-center text-teal-500 flex-grow">
        <i class="fas fa-home text-xl"></i>
      </span>
      <span class="text-center text-gray-200 flex-grow">
        <i class="fas fa-user-friends text-xl"></i>
      </span>
      <span class="text-center text-green-500 flex-grow">
        <i class="fas fa-plus-circle text-xl"></i>
      </span>
    </div>
    
    <!-- Title -->
    <div class="h-64 flex items-center">
      <h1 class="text-gray-800 uppercase app-title title-styled leading-tight">
        <span class="text-3xl">Nightly</span>
        <br>
        <span class="text-6xl font-bold">Roulette</span>
      </h1>
    </div>

    <!-- Tabs -->
    <div class="tabs mb-8 sticky" style="top: 55px;">
      <div class="tab active" style="flex-basis: 50%;">Movies</div>
      <div class="tab" style="flex-basis: 50%;">TV</div>
    </div>

    <!-- Filters -->
    <div class="btn-group mb-2">
      <button class="btn btn-teal-500 outline text-white">Time</button>
      <button class="btn btn-teal-500 outline text-white">Service</button>
    </div>

    <!-- Dice Card -->
    <div class="movie-card rounded-lg btn-indigo-600 text-center text-gray-200 py-8 mb-4">
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
    <div v-for="n in 4" :key="n" class="movie-card rounded-lg bg-gray-800 text-gray-200 px-5 py-3 mb-4">
      <div class="movie-card__title text-2xl">Annihilation</div>
      <div class="movie-card__service text-red-700 text-xl my-2">Netflix</div>
      <div class="movie-card__duration text-sm">119 minutes</div>
      <div class="movie-card__footer">
      </div>
    </div>

    <!-- Rolling Card -->
    <div class="movie-card rounded-lg bg-indigo-600 text-gray-200 px-5 py-3 mb-4">
      <div class="movie-card__title text-2xl">Annihilation</div>
      <div class="movie-card__service text-green-300 text-lg my-2">Hulu</div>
      <div class="movie-card__duration text-sm mb-5">119 minutes</div>
      <div class="movie-card__footer">
        <div class="btn-group flex">
          <button class="btn btn-orange-600 flex-grow">
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

    <!-- Add a Movie Card -->
    <div class="movie-card rounded-lg bg-indigo-500 text-gray-200 px-5 pb-3 mb-4">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import { db, fb, auth } from "@/db";
import IUser from "./interface/IUser"
import User from "./class/User"

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  // Fields
  private name: string = "";
  private email: string = "";
  private photo: string = "";
  public signedIn: boolean = false;
  public users: User[] = [];
  private paralaxOffset: number = 0;
  public titleBgSolid: boolean = false;

  //Properties
  get paralaxValue() {
    return {
      top: `-${this.paralaxOffset * .5}px`
    }
  }

  // Methods
  init(): void {
    db.collection("users")
    .onSnapshot((doc) => {
      doc.docChanges().forEach(change => {
        let doc = change.doc;
        // let _user: User = new User();
        // this.users.push(_user);
      })
    })    
  }

  login(): void {
    let provider = new auth.GoogleAuthProvider();
    fb.auth().signInWithRedirect(provider)
    .catch((error) => {
      console.error("Authentication error: ", error);
    })
  }

  logOut(): void {
    fb.auth().signOut();
    window.location.reload();
  }

  // Lifecycle Hooks
  created() {
    window.addEventListener("scroll", (): void => {

      // paralax calc
      let scrolled = window.pageYOffset;
      this.paralaxOffset = scrolled;

      // header bg
      let titleRect = document.querySelector(".app-title")!.getBoundingClientRect();
      this.titleBgSolid = titleRect.bottom < 0 ? true : false;
      console.log(this.titleBgSolid)
    });
    this.init();    
    fb.auth().onAuthStateChanged((user: any | null) => {
      if(user) {
        console.log("user: ", user.providerData);
        this.photo = user.providerData[0].photoURL;
        this.signedIn = true;
      } else {
        this.signedIn = false;
      }
    })
  }
}
</script>
