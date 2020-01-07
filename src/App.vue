<template>
  <f7-app :params="app_params">
    <f7-navbar color='pink' title="Tinder Lite">
    </f7-navbar>
    <f7-page>
      <router-view></router-view>
      <f7-fab v-if="isAuthenticated" position="right-bottom" slot="fixed" color="pink">
        <f7-icon f7="chevron_compact_up"></f7-icon>
        <f7-icon f7="chevron_compact_down"></f7-icon>
        <f7-fab-buttons position="top">
          <f7-fab-button @click="goToHome" fab-close label="Tìm bạn">
            <f7-icon f7="heart"></f7-icon>
          </f7-fab-button>
          <f7-fab-button @click="gotoProfile" fab-close label="Hồ sơ">
            <f7-icon f7="person"></f7-icon>
          </f7-fab-button>
          <f7-fab-button @click="goToMatches" fab-close label="Tương hợp">
            <f7-icon f7="hand_thumbsup"></f7-icon>
          </f7-fab-button>
          <f7-fab-button fab-close label="Cài đặt">
            <f7-icon f7="gear_alt"></f7-icon>
          </f7-fab-button>
        </f7-fab-buttons>
      </f7-fab>
    </f7-page>
  </f7-app>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  computed:{
    ...mapGetters(['isAuthenticated','accessToken','userProfile'])
  },
  methods:{
    ...mapActions(['login','logout']),
    goToHome(){
      this.$router.replace("/");
    },
    goToMatches(){
      this.$router.replace("/matches");
    },
    gotoProfile(){
      this.$router.replace("/profile")
    }
  },
  data(){
    return {
      app_params:{
        name: "TinderLite",
        id: 'com.tinderlite.app' 
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>