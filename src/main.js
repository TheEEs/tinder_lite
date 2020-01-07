/*eslint no-console: warn */
/*eslint no-unused-vars: warn*/
import Vue from 'vue'
import Main from './App.vue'
import router from './router'
import store from './store'
import Framework7 from 'framework7/framework7-lite.esm.bundle';
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';
import 'framework7/css/framework7.bundle.min.css';
import {Plugins} from '@capacitor/core';
import Auth0Cordova from '@auth0/cordova';
import {mapGetters,mapActions} from 'vuex';
import 'framework7-icons/css/framework7-icons.css';
import './notification';

const {App} = Plugins;
App.addListener("appUrlOpen",function({url}){
  Auth0Cordova.onRedirectUri(url);
})
Framework7.use(Framework7Vue);

Vue.config.productionTip = false


new Vue({
  router,
  store,
  data:{
    
  },
  computed:{
    ...mapGetters(['isAuthenticated','accessToken','userProfile'])
  },
  methods:{
    ...mapActions(['resumeApp'])
  },
  render: h => h(Main),
  mounted(){
    this.resumeApp();
  },
  created(){
    this.resumeApp();
  }
}).$mount('#app')
