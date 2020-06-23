import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import ListPage from "../views/ListPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/movie-pool",
    name: "Movie Pool",
    component: ListPage
  }
];

const router = new VueRouter({
  routes
});

export default router;
