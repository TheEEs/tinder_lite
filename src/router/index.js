/*eslint no-unused-vars:warn */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Likes from '../views/Likes.vue';
import Match from '../views/Match.vue';
import Profile from '../views/Profile.vue';
import store from '../store';
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    component: Likes,
  },
  {
    path: "/matchs",
    component: Match,
    beforeEnter(to,from,next){
      if(store.state.user_registed) next();
      else next("/");
    }
  },
  {
    path: "/profile",
    component: Profile,
    beforeEnter(to,from,next){
      if(store.state.authenticated) next();
      else next("/");
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
