import "reflect-metadata";
import { container } from "tsyringe";
import { AppStore } from "@/store";
import { TMDBMovieSearch, TMDBStreamProvider, TMDBMovie } from "@/types/tmdb";
import TMDBService from "@/api/tmdbService";

container.register("IMovieDatabaseService", { useClass: TMDBService });

const AppStoreContainer =
  container.resolve<AppStore<TMDBMovieSearch, TMDBStreamProvider, TMDBMovie>>(
    AppStore
  );

export default AppStoreContainer;
