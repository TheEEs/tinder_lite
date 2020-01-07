<template>
    <div>
        <f7-button v-if='!isAuthenticated' @click="logyouin">Đăng nhập</f7-button>
        <template v-if="isAuthenticated && user_registed">
            <Card />
        </template>
    </div>
</template>
<style lang="scss">
.user{
    img{
        max-width: 100%;
    }
}
</style>
<script>
/*eslint no-console:warn */
/*eslint no-unused-vars:warn */
/*eslint no-constant-condition: off */
import {mapActions,mapGetters,mapMutations,mapState} from 'vuex';
import {Plugins} from '@capacitor/core';
const {Toast} = Plugins;
import {profileAPIs,likeAPIs} from '../request';
import Card from "../components/Cards";
const {loadProfile} = profileAPIs;
const _ = require('lodash');

export default {
    data(){
        return {

        }
    },
    methods:{
        ...mapActions(['login','logout']),
        ...mapMutations(['set_user_registered','set_userProfile','set_users','loadUsers']),
        async showAT(){
            console.log(this.accessToken);
            await Toast.show({
                text: this.accessToken
            });
        },
        async logyouin(){
            const result = await this.login();
            this.$f7.dialog.preloader("Tải hồ sơ của bạn...",'red');
            if(result){
                const profile_created = await loadProfile();
                if(!profile_created)
                    this.$router.replace("/profile");
            }
            this.$f7.dialog.close();
        }
    },
    computed:{
        ...mapGetters(['isAuthenticated','accessToken']),
        ...mapState(['userProfile','users','user_registed']),
        user_avatars(){
            return _.map(this.users,'avatar_url');
        }
    },
    mounted(){
        setTimeout(async ()=>{
            while(!this.$f7){
                await new Promise(resolve => {
                    setTimeout(()=>{
                        resolve(true);
                    },0);
                });
            }
            if(this.isAuthenticated){
                if(!this.$store.state.userProfile){
                    this.$f7.dialog.preloader("Tải hồ sơ của bạn...",'red');
                    const profile_created =  await loadProfile();
                    if(!profile_created && this.isAuthenticated)
                        this.$router.replace("/profile");
                    else if(profile_created){
                        this.set_user_registered(true);
                        this.set_userProfile(profile_created);
                    }
                }
                this.$f7.dialog.close();
            }
        },0);
    },
    components:{
        Card
    }
}

</script>