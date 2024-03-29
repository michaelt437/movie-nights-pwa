import "../node_modules/@fortawesome/fontawesome-free/css/all.css";
import "./styles/main.scss";
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import { firestorePlugin } from "vuefire";
import moment from "moment";
import router from "./router";
import AppStoreContainer from "@/StateManagementContainer";

Vue.config.productionTip = false;
Vue.prototype.$moment = moment;

Vue.use(firestorePlugin);

new Vue({
  router,
  store: AppStoreContainer.store,
  render: h => h(App)
}).$mount("#app");
