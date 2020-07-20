<template>
  <div id="rolling-card">
    <div v-if="rollPending" class="movie-card rounded-lg bg-indigo-600 text-gray-200 px-5 py-3 mb-4">
      <div class="movie-card__title text-2xl capitalize">{{ randomMovie.title }}</div>
      <div class="movie-card__service text-lg my-2" :class="randomMovie.service.value">{{ randomMovie.service.title }}</div>
      <div class="movie-card__duration text-sm mb-5">{{ randomMovie.duration }} minutes</div>
      <div class="movie-card__footer">
        <div class="btn-group flex">
          <button class="btn btn-white outline flex-grow" @click="rollPending = false">
            <i class="fas fa-times"></i>
          </button>
          <button class="btn flex-grow" :class="reRollColor" @click="reRoll">
            <i class="fas fa-dice"></i> ({{ this.$store.getters.getCurrentUser.rolls }})
          </button>
          <button class="btn btn-teal-400 flex-grow" style="flex-basis: 35%" @click="confirmSelection">
            <i class="fas fa-check"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="movie-card rounded-lg btn-indigo-600 text-center text-gray-200 py-8 mb-4 cursor-pointer" @click="makeRoll">
      <div class="text-2xl">What's the pick?</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IMovie from "@/interface/IMovie";
import CardMovie from "@/components/CardMovie.vue";
import { db, fb } from "@/db.ts";

@Component({
  components: {
    CardMovie
  }
})
export default class CardMovieRoll extends Vue {
  private rollPending = false;
  private prevIndex: number | null = null;
  private currIndex: number | null = null;
  private rollsLeft = 3;

  get moviesToPickList (): Array<IMovie> {
    return this.$store.getters.getMoviesToWatch;
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

  randomMovieIndex (): void {
    this.prevIndex = this.currIndex;
    this.currIndex = Math.floor(Math.random() * this.moviesToPickList.length);
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

  confirmSelection (): void {
    const _watchDate = Date.parse(new Date());
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
  }

  create () {
    this.rollsLeft = this.$store.getters.getCurrentUser.rolls;
  }
}

</script>
