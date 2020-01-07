<template>
    <div>
        <f7-progressbar v-if="!loaded" infinite color="multi"></f7-progressbar>
        <template v-if="loaded">
            <f7-row>
                <f7-col width="10"></f7-col>
                    <f7-col width="80">
                        <p id='reminder' v-show="!user_registed">Hoàn tất hồ sơ của bạn ngay lúc này</p>
                        <img @click="changeAvatar" :src="avatar" v-if="avatar"/>
                        <f7-button v-else fill color="yellow" @click="changeAvatar">New avatar</f7-button>
                    </f7-col>
                    <f7-col width="10"></f7-col>
                </f7-row>    
            <f7-list>
                <f7-list-input :disabled="user_registed" type="text" label="Name" placeholder="Your name"
                    :value="userInfo.name" @input="userInfo.name = $event.target.value"
                ></f7-list-input>
                <f7-list-input :disabled="user_registed" label="Gender"
                    type="select"
                    placeholder="Please choose..."
                    :value="gender" @change="setGender">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </f7-list-input>
                <f7-list-input :disabled="user_registed" :value="userInfo.date_of_birdth" 
                    @input="userInfo.date_of_birdth = $event.target.value"
                    type="date" label="Date of birdth">

                </f7-list-input>
                <f7-list-input type='textarea' label="Intro"
                    :value="userInfo.intro" @input="userInfo.intro = $event.target.value">
                </f7-list-input>
                <f7-list-button v-if="!user_registed"  @click="finishProfile" color="blue" title="Hoàn tất"></f7-list-button>
                <f7-list-button v-else @click="updateProfile" color="green" title="Cập nhật"></f7-list-button>
                <f7-list-button @click="logout" color="yellow" title="Đăng xuất"></f7-list-button>
                <f7-list-button v-if="user_registed" @click="cancelAccount" color="red" title="Xóa tài khoản"></f7-list-button>
            </f7-list>
            {{userInfo}}
            <input @change="avatar_change" id="avt" type="file" accept="image/*">
        </template>
    </div>
</template>
<style scoped>
    img{
        max-width: 100%;
        object-position: center;
        object-fit: fill;
        border-radius: 6px;
        box-sizing: border-box;
        margin-top: 9px;
    }
    #reminder{
        color: #c0392b;
        margin-top: 6px;
        margin-bottom: 3px;
    }
</style>
<script>
/*eslint no-unused-vars:warn */
/*eslint no-console:warn */
/*eslint no-undef: warn */
import {profileAPIs} from '../request';
const {loadProfile, createProfile, updateProfile, deleteUser} = profileAPIs;
import {mapMutations,mapState} from 'vuex';
import {Plugins} from '@capacitor/core';
import Vue from 'vue';
import { format } from 'path';
const {Toast, Modals} = Plugins;
export default {
    data: function(){
        return {
            userInfo: {
                name: null,
                gender: false,
                date_of_birdth: "",
                avatar: false,
                intro: ""
            },
            avatar: false,
            loaded: false
        }
    },
    computed:{
        gender(){
            return this.userInfo.gender ? "Female" : "Male";
        },
        formData(){
            return 1;
        },
        ...mapState(['user_registed'])
    },
    methods:{
        async setGender(e){
            this.userInfo.gender = e.target.value == "Female"
            await Toast.show(e.target.value)
        },
        ...mapMutations(['set_userProfile','set_user_registered']),
        async changeAvatar(){
            const avt = document.querySelector("#avt");
            avt.click();
        },
        async avatar_change(e){
            const file = e.target.files[0];
            Vue.set(this.userInfo,'avatar',file)
            const freader = new FileReader();
            freader.onload = ()=>{
                const dataUrl = freader.result;
                this.avatar = dataUrl;
            }
            freader.readAsDataURL(file);
        },
        async finishProfile(){
            this.$f7.dialog.preloader("Hoàn tất hồ sơ của bạn...","pink");
            const formData = new FormData();
            formData.append('user[name]',this.userInfo.name);
            formData.append('user[date_of_birdth',this.userInfo.date_of_birdth);
            formData.append('user[avatar]',this.userInfo.avatar);
            formData.append('user[gender]',this.userInfo.gender);
            formData.append('user[intro]',this.userInfo.intro);
            const result = await createProfile(formData);
            if(result){
                this.set_user_registered(true);
                this.$f7.dialog.close();
            }
            else
                await Toast.show({text: "Profile skipped"})
        },
        async updateProfile(){
            this.$f7.dialog.preloader("Cập nhật hồ sơ của bạn...","green");
            const formData = new FormData();
            if(this.userInfo.avatar)
                formData.append('user[avatar]',this.userInfo.avatar);
            else
                formData.append('user[avatar]',false);
            formData.append('user[intro]',this.userInfo.intro);
            formData.append('user[name]',this.userInfo.name);
            formData.append('user[date_of_birdth',this.userInfo.date_of_birdth);
            const result = await updateProfile(formData);
            
            if(result){
                await Toast.show({text:"Profile updated"});
            }
            else 
                await Toast.show({text: "Profile not updated"});
            this.$f7.dialog.close();
        },
        async logout(){
            await this.$store.dispatch("logout");
        },
        async cancelAccount(){
            let confirmRet = await Modals.confirm({
                title: 'Nguy hiểm',
                message: 'Bạn chắc rằng sẽ muốn xóa tài khoản của mình chứ?',
                okButtonTitle: 'Đồng ý',
                cancelButtonTitle: 'Hủy'
            });
            if(confirmRet.value){
                this.$f7.dialog.preloader("Đang gỡ bỏ...");
                const response = await deleteUser();
                if(response){
                    this.logout();
                }
                else 
                await Toast.show({text: "Could not log you out, sorry"});
                this.$f7.dialog.close();
            }
        }
    },
    async mounted(){
        const userProfile = await loadProfile();
        if(userProfile){
            this.set_user_registered(true);
            this.userInfo = userProfile;
            this.avatar =  "http://192.168.0.105:3000" + userProfile.avatar_url;
        }
        this.loaded = true;
    }
}
</script>