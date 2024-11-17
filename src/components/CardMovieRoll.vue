<template>
  <div id="rolling-card" class="relative">
    <div
      v-if="rollPending"
      class="movie-card rounded-lg bg-indigo-600 text-gray-200 px-5 py-3 mb-4"
    >
      <div class="movie-card__title flex items-center text-2xl capitalize">
        {{ randomMovie.title }}
        <i
          v-show="isRewatch"
          class="fas fa-sync text-green-300 ml-auto"
          title="Rewatch"
        ></i>
      </div>
      <div class="movie-card__duration text-sm my-4">
        {{ formatDuration(randomMovie.runtime) }}
      </div>
      <div class="movie-card__service flex items-center text-lg my-2">
        <img
          v-if="!randomMovie.customProvider && providerLogo"
          :src="providerLogo"
          title="provider"
          class="rounded-full w-5 h-5 mr-2"
        />
        {{ displayProviderText }}
      </div>
      <div class="movie-card__footer">
        <div class="btn-group flex">
          <button
            class="btn btn-white outline flex-grow"
            @click="rollPending = false"
          >
            <i class="fas fa-times"></i>
          </button>
          <button class="btn flex-grow" :class="reRollColor" @click="reRoll">
            <i class="fas fa-dice"></i> ({{
              isSignedIn
                ? this.$store.getters.getCurrentUser.rolls
                : this.$store.state.rollsInMemory
            }})
          </button>
          <button
            class="btn btn-green-400 flex-grow"
            style="flex-basis: 35%"
            @click="confirmSelection"
          >
            <i class="fas fa-check"></i>
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="movie-card rounded-lg btn-indigo-600 text-center text-gray-200 py-8 mb-4 cursor-pointer relative"
      :class="{ 'pointer-events-none': !moviesToPickList.length && isSignedIn }"
      @click="moviesToPickList.length ? makeRoll() : invokeAddDrawer()"
    >
      <div class="text-2xl">
        <template v-if="moviesToPickList.length"> What's the Pick? </template>
        <template v-else>
          {{ isSignedIn ? `No matches` : `Add a Movie` }}
        </template>
      </div>
    </div>

    <button
      v-show="!rollPending"
      id="pick-filter"
      class="btn btn-green-500 text-gray-200 absolute"
      @click.stop="invokeDrawer"
    >
      Categories: {{ pickCategories }}
    </button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { doc, increment, setDoc, updateDoc } from "firebase/firestore";
import IMovie from "@/types/interface/IMovie";
import CardMovie from "@/components/CardMovie.vue";
import { db } from "@/db";
import { TMDBConfig, TMDBGenre } from "@/types/tmdb";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    CardMovie
  }
})
export default class CardMovieRoll extends Vue {
  rollPending = false;
  prevIndex: number | null = null;
  currIndex: number | null = null;
  rollsLeft = 3;

  get isSignedIn (): boolean {
    return this.$store.state.signedIn;
  }

  get moviesToPickList (): Array<IMovie> {
    return this.$store.getters.getMoviesToWatch
      .filter((movie: IMovie) => !movie.exclude)
      .filter(
        (movie: IMovie) => movie.customProvider || movie.providers?.length
      )
      .filter((movie: IMovie) => {
        if (this.$store.getters.getServiceCategories.length) {
          if (movie.customProvider) {
            return this.$store.getters.getServiceCategories.includes(
              movie.customProviderModel!.provider_name
            );
          } else {
            return this.$store.getters.getServiceCategories.includes(
              movie.providers[0].provider_name
            );
          }
        } else {
          return true;
        }
      })
      .filter((movie: IMovie) => {
        if (this.$store.getters.getDurationCategories.length) {
          if (this.$store.getters.getDurationCategories.includes("short")) {
            if (Number(movie.runtime) < 107) {
              return movie;
            }
          }
          if (this.$store.getters.getDurationCategories.includes("long")) {
            if (Number(movie.runtime) >= 107 && Number(movie.runtime) <= 134) {
              return movie;
            }
          }
          if (this.$store.getters.getDurationCategories.includes("realLong")) {
            if (Number(movie.runtime) > 134) {
              return movie;
            }
          }
        } else {
          return true;
        }
      })
      .filter((movie: IMovie) => {
        if (this.$store.getters.getGenreCategories.length) {
          return movie.genres.some((genre: TMDBGenre) => {
            return this.$store.getters.getGenreCategories.includes(genre.name);
          });
        } else {
          return true;
        }
      });
  }

  get randomMovie (): IMovie {
    const movie = this.moviesToPickList[this.currIndex!];
    return movie;
  }

  get reRollColor () {
    switch (this.$store.getters.getCurrentUser.rolls) {
      default:
      case 3:
        return "btn-pink-500";
      case 2:
        return "btn-orange-500";
      case 1:
        return "btn-red-600";
    }
  }

  get pickCategories (): number | string {
    let pickingFrom: number | string = 0;
    if (this.$store.getters.getDurationCategories.length) {
      pickingFrom += this.$store.getters.getDurationCategories.length;
    }
    if (this.$store.getters.getServiceCategories.length) {
      pickingFrom += this.$store.getters.getServiceCategories.length;
    }
    if (this.$store.getters.getGenreCategories.length) {
      pickingFrom += this.$store.getters.getGenreCategories.length;
    }
    return !pickingFrom ? "All" : pickingFrom;
  }

  get isRewatch (): boolean {
    return Boolean(
      this.$store.getters.getMoviesWatched.find((paramMovie: IMovie) => {
        if (paramMovie.service) {
          return (
            paramMovie.title.toLowerCase() ===
              this.randomMovie.title.toLowerCase() && paramMovie.hasWatched
          );
        }
        if (paramMovie.id) {
          return paramMovie.id === this.randomMovie.id && paramMovie.hasWatched;
        }
      })
    );
  }

  get tmdbConfig (): TMDBConfig {
    return this.$store.state.config;
  }

  get providerLogo (): string {
    return `${this.tmdbConfig.images.secure_base_url}${this.tmdbConfig.images.logo_sizes[0]}${this.randomMovie.providers[0].logo_path}`;
  }

  get displayProviderText (): string {
    if (this.randomMovie.customProvider) {
      return this.randomMovie.customProviderModel!.provider_name!;
    }

    return this.randomMovie.providers[0].provider_name;
  }

  get directorCredit (): string | undefined {
    return this.randomMovie.credits.crew.find(
      (member) => member.job === "Director"
    )?.name;
  }

  get posterUrl (): string | undefined {
    if (this.randomMovie.poster_path) {
      return `${this.tmdbConfig.images.secure_base_url}${this.tmdbConfig.images.poster_sizes[4]}${this.randomMovie.poster_path}`;
    } else {
      return undefined;
    }
  }

  invokeDrawer (): void {
    this.$emit("drawer", "DrawerPickFilter");
  }

  invokeAddDrawer (): void {
    this.$emit("drawer", "DrawerAddMovie");
  }

  randomMovieIndex (): void {
    this.prevIndex = this.currIndex;
    this.currIndex = Math.floor(Math.random() * this.moviesToPickList.length);

    if (this.moviesToPickList.length === 1) {
      return;
    }

    if (this.currIndex === this.prevIndex) {
      this.randomMovieIndex();
    }
  }

  decrementRolls (): void {
    if (this.isSignedIn) {
      updateDoc(
        doc(db, "users", this.$store.getters.getCurrentUserDocumentId),
        {
          rolls: increment(-1)
        }
      );
      this.$store.commit("decrementRolls");

      if (this.$store.getters.getCurrentUser.rolls === 0) {
        this.confirmSelection();
      }
    } else {
      this.$store.commit("decrementRollsInMemory");
      if (this.$store.state.rollsInMemory === 0) {
        this.confirmSelection();
      }
    }
  }

  reRoll (): void {
    this.randomMovieIndex();
    this.decrementRolls();
  }

  makeRoll (): void {
    this.rollPending = true;
    this.randomMovieIndex();
    this.decrementRolls();

    if (
      !isEmpty(this.$store.getters.getCurrentUser) &&
      !this.$store.getters.getCurrentUser.hasRolled
    ) {
      this.$store.commit("updateUserHasRolled", true);
    } else {
      this.$store.commit("updateHasRolledInMemory", true);
    }
  }

  formatDuration (duration: string | number): string {
    const _duration: number =
      typeof duration === "string" ? parseInt(duration) : duration;
    return `${Math.floor(_duration / 60)}hr ${_duration % 60}m`;
  }

  async confirmSelection (): Promise<void> {
    if (this.isSignedIn) {
      const _watchDate = Number(Date.parse(Date()));
      this.randomMovie.watchDate = _watchDate;
      this.randomMovie.user = this.$store.getters.getCurrentUser.name;
      await setDoc(doc(db, "tonightsPick", "movie"), this.randomMovie);

      await updateDoc(
        doc(
          db,
          this.$store.getters.getCurrentUserDocumentId,
          this.randomMovie.documentId as string
        ),
        {
          hasWatched: true,
          watchDate: _watchDate
        }
      );

      await updateDoc(
        doc(db, "users", this.$store.getters.getCurrentUserDocumentId),
        {
          hasPicked: true,
          pickedDateTime: _watchDate
        }
      );

      await fetch(
        "https://discord.com/api/webhooks/1288913188473274441/6854Z6uq6KUKLFoevNzi_3YMsKe6riSEh4ngbXJq2W9sKZ98scDH-MetBOw4IGD2mptZ",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: "Movie Nights Roulette",
            embeds: [
              {
                title: `${this.randomMovie.title.toUpperCase()}`,
                description: `${this.randomMovie.overview}`,
                fields: [
                  {
                    name: "Director",
                    value: `${this.directorCredit}`,
                    inline: true
                  },
                  {
                    name: "Released",
                    value: `${this.$moment(
                      this.randomMovie.release_date
                    ).format("YYYY")}`,
                    inline: true
                  },
                  {
                    name: "Runtime",
                    value: `${this.randomMovie.runtime} min`,
                    inline: true
                  }
                ],
                thumbnail: {
                  url: `${this.posterUrl}`
                },
                footer: {
                  text: `${this.randomMovie.providers[0].provider_name}`,
                  icon_url: `${this.providerLogo}`
                }
              }
            ]
          })
        }
      );
      this.$store.commit("updateRollPermission", false);
      this.$store.commit("setTonightsPick", this.randomMovie);
    } else {
      this.randomMovie.user = "Tonight";
      this.$store.commit("updateRollPermission", false);
      this.$store.commit("setTonightsPick", this.randomMovie);
    }
  }

  create () {
    this.rollsLeft = this.$store.getters.getCurrentUser.rolls;
  }
}
</script>
<style lang="scss" scoped>
#pick-filter {
  top: -50%;
  transform: translateY(70%);
  left: 20px;
}
</style>
