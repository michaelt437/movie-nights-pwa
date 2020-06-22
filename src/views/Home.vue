<template>
  <div class="pb-5 px-5" style="margin-top: 56px;">

    <div class="fixed left-0 h-64" style="z-index: -1;" :style="paralaxValue">
      <img class="hero inline" src="../assets/hero.jpg" alt="">
    </div>

    <!-- Title -->
    <div class="flex items-center text-center justify-center" style="height: 16rem;">
      <h1 class="text-gray-800 uppercase app-title title-styled leading-tight">
        <span class="text-3xl">Movie Nights</span>
        <br>
        <span class="text-5xl font-bold">Roulette</span>
      </h1>
    </div>

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
    <div class="btn-group mb-2">
      <button class="btn btn-transparent text-gray-500 text-md ml-auto">
        <i class="fas fa-sliders-h"></i>
      </button>
    </div>

    <!-- Rolling Card -->
    <div v-if="isPicking" class="movie-card rounded-lg bg-indigo-600 text-gray-200 px-5 py-3 mb-4">
      <div class="movie-card__title text-2xl">Annihilation</div>
      <div class="movie-card__service text-green-300 text-lg my-2">Hulu</div>
      <div class="movie-card__duration text-sm mb-5">119 minutes</div>
      <div class="movie-card__footer">
        <div class="btn-group flex">
          <button class="btn btn-white outline flex-grow" @click="isPicking = false">
            <i class="fas fa-times"></i>
          </button>
          <button class="btn btn-pink-600 flex-grow">
            <i class="fas fa-dice"></i> (4)
          </button>
          <button class="btn btn-teal-400 flex-grow" style="flex-basis: 35%">
            <i class="fas fa-check"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Dice Card -->
    <div v-else class="movie-card rounded-lg btn-indigo-600 text-center text-gray-200 py-8 mb-4 cursor-pointer" @click="isPicking = true">
      <div class="text-2xl">What's the pick?</div>
    </div>

    <!-- Picked cards -->
    <template v-for="movie in picks">
      <card-movie
      :key="movie.title"
      :movie="movie"></card-movie>
    </template>

    <div class="pt-4 py-16 text-gray-600 text-center">Your beginning...</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { db, fb, auth } from "@/db";
import IUser from "../interface/IUser";
import User from "../class/User";
import CardMovie from "@/components/CardMovie.vue";

@Component({
  components: {
    CardMovie
  }
})
export default class Home extends Vue {
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
      service: {
        title: "Hulu",
        value: "hulu"
      },
      duration: 119
    },
    {
      title: "Blade Runner 2049",
      service: {
        title: "Netflix",
        value: "netflix"
      },
      duration: 145
    },
    {
      title: "The Lighthouse",
      service: {
        title: "Amazon Prime",
        value: "amazon"
      },
      duration: 92
    },
    {
      title: "The Martian",
      service: {
        title: "DVD/Bluray",
        value: "disc"
      },
      duration: 132
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

  // Lifecycle Hooks
  created () {
    window.addEventListener("scroll", (): void => {
      // paralax calc
      const scrolled = window.pageYOffset;
      this.paralaxOffset = scrolled;

      // header bg
      const titleRect = document.querySelector(".app-title")?.getBoundingClientRect();
      this.titleBgSolid = titleRect!.bottom < 0;
      this.$emit("scrolling", this.titleBgSolid);
    });
  }
}
</script>
