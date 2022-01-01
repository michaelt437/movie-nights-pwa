<template>
  <div
    class="movie-card rounded-lg text-gray-200 mb-4 flex flex-col overflow-hidden"
    :class="excludeMovie ? 'bg-gray-900 movie-card--exclude' : 'bg-gray-800'"
    @click="showActions = !showActions"
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
      <div class="movie-card__service flex items-center text-md py-3">
        <img
          v-if="!movie.customProvider && providerLogo"
          :src="providerLogo"
          title="provider"
          class="rounded-full w-5 h-5 mr-2"
        />
        {{ displayProviderText }}
      </div>
      <div class="movie-card__footer flex justify-between items-center mt-2">
        <div class="movie-card__duration text-sm">
          {{ formatDuration(movie.runtime) }}
        </div>
        <div class="movie-card__genres text-sm">
          <template v-for="(genre, index) in movie.genres">
            <span
              v-if="index < 3"
              :key="genre.id"
              class="border border-gray-600 mr-1 px-2 rounded-sm"
            >
              {{ genre.name }}
            </span>
          </template>
          <span
            v-if="movie.genres.length > 3"
            class="border border-gray-600 mr-1 px-2 rounded-sm"
          >
            {{ `+${movie.genres.length - 3}` }}
          </span>
        </div>
      </div>
      <div v-show="showActions" class="pt-6 pb-2">
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
    <div
      class="movie-card__actions text-center border-t border-gray-700 px-5 py-3"
    >
      <i
        class="fas text-md"
        :class="showActions ? `fa-caret-up` : `fa-caret-down`"
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import IMovie from "@/types/interface/IMovie";
import { TMDBConfig } from "@/types/tmdb";
import { db } from "@/db";
import { isEqual } from "lodash";

@Component
export default class CardMovieEditable extends Vue {
  @Prop(Object) readonly movie!: IMovie;

  excludeMovie = false;
  showActions = false;

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

  editMovie (): void {
    this.$emit("popup", "PopupEditMovie", this.movie, null, () => {
      this.showActions = false;
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

  async refreshProviders (): Promise<void> {
    const _providers = await this.$store.dispatch("fetchWatchProviders", {
      movieId: this.movie.id
    });
    if (!isEqual(this.movie.providers, _providers)) {
      this.$store.commit("updateProviders", {
        documentId: this.movie.documentId,
        newProviders: _providers
      });
    }
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
