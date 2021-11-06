import "reflect-metadata";
import { container } from "tsyringe";
import { AppStore } from "@/store";
import { TMBDMovieSearch, TMDBStreamProvider } from "@/types/tmdb";
import TMDBService from "@/api/tmdbService";

container.register("IMovieDatabaseService", { useClass: TMDBService });

const AppStoreContainer = container.resolve<
  AppStore<TMBDMovieSearch, TMDBStreamProvider>
>(AppStore);

export default AppStoreContainer;
