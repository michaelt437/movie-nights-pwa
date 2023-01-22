<template>
  <div
		class="movie-card rounded-lg bg-gray-800 text-gray-200 mb-4 overflow-hidden"
		@click="toggleDetails"
	>
    <div class="movie-card__content py-3 px-5">
			<div class="movie-card__title flex items-center text-2xl capitalize mb-3">
				{{ movie.title }}
				<i
					v-show="isRewatch"
					class="fas fa-sync text-green-300 ml-auto"
					title="Rewatch"
				></i>
			</div>
			<div v-show="showDetails" class="movie-card__duration text-sm my-4">
				{{ formatDuration(movie.runtime) }}
			</div>
			<div v-show="showDetails" class="movie-card__genres text-sm w-full">
				<template v-for="genre in movie.genres">
					<span
						:key="genre.id"
						class="border border-gray-500 mr-1 px-2 rounded-sm"
					>
						{{ genre.name }}
					</span>
				</template>
			</div>
			<div v-show="showDetails" class="flex flex-col gap-y-6 my-6">
				<div class="movie-card__desc">
					<p class="mb-0 font-semibold">Overview</p>
					{{ movie.overview }}
				</div>
				<div class="movie-card__year">
					<p class="mb-0 font-semibold">Release Year</p>
					{{ $moment(movie.release_date).format("YYYY") }}
				</div>
				<div class="movie-card__crew">
					<p class="mb-0 font-semibold">Director</p>
					{{ directorCredit }}
				</div>
			</div>
			<div class="movie-card__footer flex justify-between my-4">
				<div
					class="movie-card__service flex items-center text-md"
					:class="movie.providers ? '' : movie.service.value"
				>
					<img
						v-if="!movie.customProvider && movie.providers"
						:src="providerLogo"
						title="provider"
						class="rounded-full w-5 h-5 mr-2"
					/>
					<template v-if="movie.providers">
						{{ displayProviderText }}
					</template>
					<template v-else>
						{{ movie.service.title }}
					</template>
				</div>
				<div class="movie-card__watch-date text-sm">
					{{ $moment(movie.watchDate).format("M.D.YYYY") }}
				</div>
			</div>
		</div>
    <div v-if="movie.credits" class="movie-card__actions text-center px-5 py-3 bg-gray-700">
      <i
        class="fas text-md"
        :class="showDetails ? `fa-caret-up` : `fa-caret-down`"
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import IMovie from "@/types/interface/IMovie";
import { TMDBConfig } from "@/types/tmdb";

@Component
export default class CardMovie extends Vue {
  @Prop(Object) readonly movie!: IMovie;

	showDetails = false;

	get isRewatch (): boolean {
	  return Boolean(
	    this.$store.getters.getMoviesWatched.find((paramMovie: IMovie) => {
	      if (paramMovie.service) {
	        return (
	      paramMovie.title.toLowerCase() === this.movie.title.toLowerCase() && paramMovie.watchDate < this.movie.watchDate
	    );
	    }
	    if (paramMovie.id) {
	      return (
	        paramMovie.id === this.movie.id &&
            paramMovie.watchDate < this.movie.watchDate
	      );
	    }
	    })
	  );
	}

	get tmdbConfig (): TMDBConfig {
	  return this.$store.state.config;
	}

	get providerLogo (): string | undefined {
	  if (this.movie.providers) {
	    return `${this.tmdbConfig.images.secure_base_url}${this.tmdbConfig.images.logo_sizes[0]}${this.movie.providers[0].logo_path}`;
	  } else {
	    return undefined;
	  }
	}

	get displayProviderText (): string {
	  if (this.movie.customProvider) {
	    return this.movie.customProviderModel!.provider_name!;
	  }

	  return this.movie.providers[0].provider_name;
	}

	get directorCredit (): string | undefined {
	  return this.movie.credits?.crew.find((member) => member.job === "Director")
      ?.name;
	}

	formatDuration (duration: string | number): string {
	  const _duration: number =
      typeof duration === "string" ? parseInt(duration) : duration;
	  return `${Math.floor(_duration / 60)}hr ${_duration % 60}m`;
	}

	toggleDetails () {
	  if (this.movie.credits) this.showDetails = !this.showDetails;
	}
}
</script>
