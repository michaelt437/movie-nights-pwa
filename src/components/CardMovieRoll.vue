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
      <div
        class="movie-card__service text-lg my-2"
        :class="randomMovie.service.value"
      >
        {{ randomMovie.service.title }}
      </div>
      <div class="movie-card__duration text-sm mb-5">
        {{ formatDuration(randomMovie.duration) }}
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
              this.$store.getters.getCurrentUser.rolls
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
      :class="{ 'pointer-events-none': !moviesToPickList.length }"
      @click="makeRoll"
    >
      <div class="text-2xl">
        <template v-if="moviesToPickList.length">
          What's the Pick?
        </template>
        <template v-else>
          No matches
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
import IMovie from "@/types/interface/IMovie";
import CardMovie from "@/components/CardMovie.vue";
import { db, fb } from "@/db.ts";

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

  get moviesToPickList (): Array<IMovie> {
    return this.$store.getters.getMoviesToWatch
      .filter(movie => !movie.exclude)
      .filter(movie => {
        if (this.$store.getters.getServiceCategories.length) {
          return this.$store.getters.getServiceCategories.includes(
            movie.service.value
          );
        } else {
          return true;
        }
      })
      .filter(movie => {
        if (this.$store.getters.getDurationCategories.length) {
          if (this.$store.getters.getDurationCategories.includes("short")) {
            if (Number(movie.duration) < 107) {
              return movie;
            }
          }
          if (this.$store.getters.getDurationCategories.includes("long")) {
            if (
              Number(movie.duration) >= 107 &&
              Number(movie.duration) <= 134
            ) {
              return movie;
            }
          }
          if (this.$store.getters.getDurationCategories.includes("realLong")) {
            if (Number(movie.duration) > 134) {
              return movie;
            }
          }
        } else {
          return true;
        }
      })
      .filter(movie => {
        if (this.$store.getters.getGenreCategories.length) {
          return movie.genres.some(genre => {
            return this.$store.getters.getGenreCategories.includes(genre.value);
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
        return (
          paramMovie.title.toLowerCase() ===
            this.randomMovie.title.toLowerCase() &&
          paramMovie.hasWatched === true
        );
      })
    );
  }

  invokeDrawer (): void {
    this.$emit("drawer", "DrawerPickFilter");
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
    db.collection("users")
      .doc(this.$store.getters.getCurrentUserDocumentId)
      .update({
        rolls: fb.firestore.FieldValue.increment(-1)
      });
    this.$store.commit("decrementRolls");

    if (this.$store.getters.getCurrentUser.rolls === 0) {
      this.confirmSelection();
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

    if (!this.$store.getters.getCurrentUser.hasRolled) {
      this.$store.commit("updateUserHasRolled", true);
    }
  }

  formatDuration (duration: string | number): string {
    const _duration: number =
      typeof duration === "string" ? parseInt(duration) : duration;
    return `${Math.floor(_duration / 60)}hr ${_duration % 60}m`;
  }

  confirmSelection (): void {
    const _watchDate = Number(Date.parse(Date()));
    this.randomMovie.watchDate = _watchDate;
    this.randomMovie.user = this.$store.getters.getCurrentUser.name;
    this.$store.commit("updateRollPermission", false);
    this.$store.commit("setTonightsPick", this.randomMovie);
    db.collection("tonightsPick")
      .doc("movie")
      .set(this.randomMovie);

    db.collection(this.$store.getters.getCurrentUserDocumentId)
      .doc(this.randomMovie.documentId)
      .update({
        hasWatched: true,
        watchDate: _watchDate
      });

    db.collection("users")
      .doc(this.$store.getters.getCurrentUserDocumentId)
      .update({
        hasPicked: true,
        pickedDateTime: _watchDate
      });

    fetch(process.env.VUE_APP_SLACKHOOK, {
      method: "POST",
      body: JSON.stringify({
        text: ":celebrate: Tonight's Pick! :celebrate:",
        // eslint-disable-next-line
        icon_emoji: ":niccage:",
        attachments: [
          {
            fallback: `${this.randomMovie.title} - ${this.randomMovie.service.title} - ${this.randomMovie.duration}`,
            // eslint-disable-next-line
            author_name: `${this.$store.getters.getCurrentUser.name}`,
            title: `${this.randomMovie.title.toUpperCase()}`,
            text: `${this.randomMovie.service.title}\n_${this.randomMovie.duration} mins_`
          }
        ]
      })
    });
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
