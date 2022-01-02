<template>
  <div
    class="movie-card rounded-lg text-gray-200 mb-4 flex flex-col overflow-hidden"
    :class="excludeMovie ? 'bg-gray-900 movie-card--exclude' : 'bg-gray-800'"
    @click="showDetails = !showDetails"
  >
    <div class="movie-card__content py-3 px-5">
      <div class="movie-card__title text-2xl flex items-center capitalize">
        {{ movie.title }}
        <span class="flex items-center ml-auto">
          <i
            v-show="isRewatch"
            class="fas fa-sync text-green-300"
            title="Rewatch"
          ></i>
          <label :for="`exclude-${titleCamelCase}`">
            <input
              type="checkbox"
              name="excludeMovie"
              :id="`exclude-${titleCamelCase}`"
              v-model="excludeMovie"
              hidden
            />
            <span class="text-3xl text-blue-400 cursor-pointer ml-2">
              <i v-show="excludeMovie" class="far fa-circle"></i>
              <i v-show="!excludeMovie" class="fas fa-check-circle"></i>
            </span>
          </label>
        </span>
      </div>
      <div
        class="movie-card__footer flex items-center my-4"
        :class="showDetails ? 'flex-wrap gap-y-4' : 'justify-between'"
      >
        <div
          class="movie-card__duration text-sm"
          :class="{ 'w-full': showDetails }"
        >
          {{ formatDuration(movie.runtime) }}
        </div>
        <div
          class="movie-card__genres text-sm"
          :class="{ 'w-full': showDetails }"
        >
          <template v-for="(genre, index) in movie.genres">
            <span
              v-if="showDetails ? true : index < 3"
              :key="genre.id"
              class="border border-gray-600 mr-1 px-2 rounded-sm"
            >
              {{ genre.name }}
            </span>
          </template>
          <span
            v-if="!showDetails && movie.genres.length > 3"
            class="border border-gray-600 mr-1 px-2 rounded-sm"
          >
            {{ `+${movie.genres.length - 3}` }}
          </span>
        </div>
      </div>
      <div class="movie-card__service flex items-center text-md">
        <img
          v-if="!movie.customProvider && providerLogo"
          :src="providerLogo"
          title="provider"
          class="rounded-full w-5 h-5 mr-2"
        />
        {{ displayProviderText }}
      </div>
      <div v-show="showDetails" class="flex flex-col gap-y-6 pt-6">
        <div class="movie-card__desc">
          <p class="mb-0 font-semibold">Overview</p>
          {{ movie.overview }}
        </div>
        <div class="movie-card__crew">
          <p class="mb-0 font-semibold">Director</p>
          {{ directorCredit }}
        </div>
        <div class="btn-group">
          <button class="btn btn-green-600 flex-grow" @click.stop="editMovie">
            Edit
          </button>
          <button class="btn btn-red-600 flex-grow" @click.stop="deletePrompt">
            Delete
          </button>
        </div>
      </div>
    </div>
    <div class="movie-card__actions text-center px-5 py-3 bg-gray-700">
      <i
        class="fas text-md"
        :class="showDetails ? `fa-caret-up` : `fa-caret-down`"
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import IMovie from "@/types/interface/IMovie";
import { TMDBConfig } from "@/types/tmdb";
import { db } from "@/db";

@Component
export default class CardMovieEditable extends Vue {
  @Prop(Object) readonly movie!: IMovie;

  excludeMovie = false;
  showDetails = false;

  @Watch("excludeMovie", { deep: true })
  onExcludeToggle (value: boolean) {
    db.collection(this.$store.getters.getCurrentUserDocumentId)
      .doc(this.movie.documentId)
      .update({
        exclude: value
      });

    this.$store.commit("updateMovieExclude", {
      value: this.excludeMovie,
      targetTitle: this.movie.title
    });
  }

  get titleCamelCase () {
    return this.movie.title.split(" ").join("");
  }

  get isRewatch (): boolean {
    return Boolean(
      this.$store.getters.getMoviesWatched.find((paramMovie: IMovie) => {
        if (paramMovie.service) {
          return (
            paramMovie.title.toLowerCase() === this.movie.title.toLowerCase() &&
            paramMovie.hasWatched
          );
        }
        if (paramMovie.id) {
          return paramMovie.id === this.movie.id && paramMovie.hasWatched;
        }
      })
    );
  }

  get tmdbConfig (): TMDBConfig {
    return this.$store.state.config;
  }

  get providerLogo (): string | undefined {
    if (this.movie.providers.length > 0) {
      return `${this.tmdbConfig.images.secure_base_url}${this.tmdbConfig.images.logo_sizes[0]}${this.movie.providers[0].logo_path}`;
    }
  }

  get displayProviderText (): string {
    if (this.movie.customProvider) {
      return this.movie.customProviderModel!.provider_name!;
    }

    if (this.movie.providers.length) {
      return this.movie.providers[0].provider_name;
    } else {
      return "Unavailable";
    }
  }

  get directorCredit (): string | undefined {
    return this.movie.credits.crew.find((member) => member.job === "Director")
      ?.name;
  }

  editMovie (): void {
    this.$emit("popup", "PopupEditMovie", this.movie, null, () => {
      this.showDetails = false;
    });
  }

  deletePrompt (): void {
    this.$emit(
      "popup",
      "PopupConfirm",
      this.movie,
      "Are you sure you want to delete this movie?",
      this.deleteMovie,
      `${this.movie.title.toUpperCase()} has been deleted.`
    );
  }

  deleteMovie (): void {
    db.collection(this.$store.getters.getCurrentUserDocumentId)
      .doc(this.movie.documentId)
      .delete();
    this.$store.commit("deleteMovieFromList", this.movie);
  }

  formatDuration (duration: string | number): string {
    const _duration: number =
      typeof duration === "string" ? parseInt(duration) : duration;
    return `${Math.floor(_duration / 60)}hr ${_duration % 60}m`;
  }

  mounted () {
    this.excludeMovie = this.movie.exclude!;
  }
}
</script>
<style lang="scss" scoped>
.movie-card,
.movie-card > * {
  transition: all 0.2s ease-out;
}

.movie-card--exclude {
  .movie-card__title,
  .movie-card__service,
  .movie-card__duration,
  .movie-card__genres {
    opacity: 0.5;
  }
}
</style>
