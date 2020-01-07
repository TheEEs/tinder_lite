/*eslint no-console:warn */
/*eslint no-unused-vars:warn*/
import Vue from 'vue'
import Vuex from 'vuex'
import Auth0Cordova from '@auth0/cordova';
import Auth0 from 'auth0-js';
import {Plugins, Toast} from '@capacitor/core';
import {appId} from '../../capacitor.config.json';
const {Browser} = Plugins;
import router from '../router';
import {deviceTokenAPIs,likeAPIs,matchAPIs} from '../request';

Vue.use(Vuex)

const _ = require("lodash");


async function openUrl(url) {
  await Browser.open({url})
}

function getRedirectUrl() {
  var returnTo = appId + '://dev-bt48hc1v.auth0.com/cordova/' + appId + '/callback';
  var url = 'https://dev-bt48hc1v.auth0.com/v2/logout?client_id=DhYp1nX07TlTIY0PMTO2JeY3h5XUBZqu&returnTo=' + returnTo;
  return url;
}

const auth0 = new Auth0.Authentication({
  domain: 'dev-bt48hc1v.auth0.com',
  clientID: 'DhYp1nX07TlTIY0PMTO2JeY3h5XUBZqu',
})


const store = new Vuex.Store({
  state: {
    authenticated: false,
    access_token : false,
    userProfile: false,
    user_registed: false,
    device_token: null,
    users:[]
  },
  mutations: {
    set_device_token(state,value){
      state.device_token = value;
    },
    set_userProfile(state,value){
      state.userProfile = value
    },
    set_authenticated(state,value){
      state.authenticated = value 
    },
    set_accessToken(state,value){
      state.access_token = value
    },
    set_user_registered(state,value){
      state.user_registed = value;
    },
    set_users(state,value){
      state.users.push(...value);
    }
  },
  getters: {
    isAuthenticated : (state) => state.authenticated,
    accessToken : (state) => state.access_token,
    userProfile : (state) => {
      let userProfile;
      auth0.userInfo(state.accessToken,(err,profile)=>{
        if(err)
          return console.log("failed to get user info");
        userProfile = profile;
      })
      return userProfile;
    }
  },
  actions: {
    async loadUsers({commit}){
      const loaded_users = await likeAPIs.getNewUsers();
      if(loaded_users){
        commit("set_users",_.shuffle(loaded_users));
      }else
      await Toast.show({
        text:"Could not load users's data"
      })
    },
    async login(context){
      return new Promise((resolve,reject)=>{
        const client = new Auth0Cordova({
          domain: 'dev-bt48hc1v.auth0.com',
          clientId: 'DhYp1nX07TlTIY0PMTO2JeY3h5XUBZqu',
          packageIdentifier: appId
        });
        const options = {
          scope: 'openid profile',
          audience: 'https://tinderlite.com',
        }
        client.authorize(options,async (err,authResult)=>{
          if(err){
            //this.error = err;
            return reject(false);
          }
          localStorage.setItem('access_token',authResult.accessToken);
          context.dispatch("resumeApp");
          const is_ok = await deviceTokenAPIs.addDeviceToken();
          if(!is_ok)
            await Toast.show({
              text: "Can not add this device's push notification token"
            });
          resolve(true);
        });
      });
    },
    async logout(context){
      localStorage.removeItem('access_token');
      const url = getRedirectUrl();
      await openUrl(url);
      await deviceTokenAPIs.removeDeviceToken();
      context.dispatch("resumeApp");

    },
    resumeApp({commit}){
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        commit('set_authenticated',true);
        commit('set_accessToken',accessToken);
      } else {
        commit('set_authenticated',false);
        commit('set_accessToken',null);
        commit('set_user_registered',false);
        router.replace('/');
      }
    }
  },
  modules: {
  }
})

export default store;