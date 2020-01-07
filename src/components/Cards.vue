<template>
    <div>
        <f7-card v-if="user" class="demo-card-header-pic">
            <f7-card-header
            class="no-border"
            valign="bottom"
            >
                <h4>{{user.name}}</h4>
            </f7-card-header>
            <f7-card-content>
                <img class='avatar' :src="'http://192.168.0.105:3000'+user.avatar_url" alt="">
                <p>{{user.intro}}</p>
            </f7-card-content>
            <f7-card-footer>
                <f7-button color="red" @click="like">
                    <f7-icon f7="heart"></f7-icon>Thích
                </f7-button>
                <f7-button color="green">
                    Để sau
                </f7-button>
            </f7-card-footer>
        </f7-card>    
        <f7-block class="text-align-center" v-else>
            <f7-button @click="loadUsers">Làm mới</f7-button>
        </f7-block>
    </div>    
</template>
<style lang="scss" scoped>
img.avatar{
    width: 100%;
}
div.card{
    margin-top:40px;
    max-height: 80vh;
}
</style>
<script>
import {mapState,mapActions} from "vuex";
import {likeAPIs} from '../request';
import {Plugins} from "@capacitor/core";
const {Toast} = Plugins;
export default {
    data(){
        return {
            cached_users:[]
        }
    },
    async mounted(){
        if(this.users.length == 0)
           await this.loadUsers();
    },
    computed:{
        ...mapState(['users']),
        user(){
            return this.users[0];
        }
    },
    methods:{
        async like(){
            this.cached_users.push(this.users.shift());
            if(await likeAPIs.like(this.cached_users[0].identifier)){
                this.cached_users.pop();
            }
            else{
                this.users.unshift(this.cached_users.pop());
                await Toast.show({
                    text:"Could not perform action"
                })
            }
        },
        ...mapActions(['loadUsers'])
    }
}
</script>