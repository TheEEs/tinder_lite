/*eslint no-console:warn */
/*eslint no-unused-vars:warn */
import axios from 'axios';
//import _ from 'lodash';
import {Plugins} from '@capacitor/core';
import store from '../store';

const HOSTNAME = "http://172.105.127.137"

const {Toast} = Plugins
const profileAPIs = {
    async loadProfile(){
        try{
            const response = await axios({
                method: "get",
                headers:{
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${store.state.access_token}`
                },
                url: `${HOSTNAME}/api/user`
            })
            return response.data;
        }catch(err){
            return false;
        }
    },
    async createProfile(formData){
        try{
            const response = await axios({
                method: "post",
                headers:{
                    'content-type': 'multipart/form',
                    'Authorization': `Bearer ${store.state.access_token}`
                },
                url: `${HOSTNAME}/api/users`,
                data:formData
            });
            return response.status == 201;
        }catch(err){
            return false;
        }
    },
    async updateProfile(formData){
        try{
            const response = await axios({
                method: "patch",
                headers: {
                    'content-type': 'multipart/form',
                    'Authorization' : `Bearer ${store.state.access_token}`
                },
                url: `${HOSTNAME}/api/users`,
                data: formData
            });
            return response.status == 200;
        }catch(err){
            return false;
        }
    },
    async deleteUser(){
        try{
            const response = await axios({
                method: "delete",
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': `Bearer ${store.state.access_token}`
                },
                url: `${HOSTNAME}/api/user`
            });
            return response.status == 204 
        }catch(err){
            return false;
        }
    }
}


const likeAPIs = {
    async like(userID){
        try {
            const response = await axios({
                method: "post",
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': `Bearer ${store.state.access_token}`
                },
                url: `${HOSTNAME}/api/like/${userID}`
            })
            return response;
        } catch (error) {
            return false;
        }
    },
    async getNewUsers(){
        try {
            const response = await axios({
                method: "get",
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': `Bearer ${store.state.access_token}`
                },
                url: `${HOSTNAME}/api/users`
            })
            return response.data;
        } catch (error) {
            return false;
        }
    }
}

const matchAPIs = {
    async getMatches(){
        try {
            const response = await axios({
                method: "get",
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': `Bearer ${store.state.access_token}`
                },
                url: `${HOSTNAME}/api/matches`
            })
            return response.data;
        } catch (error) {
            return false;
        }
    },
    async getMatch(matchID){
        try{
            const response = await axios({
                method: "get",
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': `Bearer ${store.state.access_token}`
                },
                url: `${HOSTNAME}/api/matches/${matchID}`
            });
            return response.data;
        }catch(err){
            return false;
        }
    },
    async unMatch(matchID){
        try {
            const response = await axios({
                method: "delete",
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': `Bearer ${store.state.access_token}`
                },
                url: `${HOSTNAME}/api/matches/${matchID}`
            });
            return response.data;
        } catch (error) {
            return false;
        }
    }
}

const deviceTokenAPIs = {
    async addDeviceToken(){
        try{
            const response = await axios({
                method: "post",
                headers: {
                    "content-type" : 'application/json',
                    'Authorization': `Bearer ${store.state.access_token}`
                },
                url: `${HOSTNAME}/api/token/add/${store.state.device_token}`
            })
            return response.status == 201;
        }catch(error){
            return false;
        }
    },
    async removeDeviceToken(){
        try{
            const response = await axios({
                method: "delete",
                headers: {
                    "content-type" : 'application/json',
                    'Authorization': `Bearer ${store.state.access_token}`
                },
                url: `${HOSTNAME}/api/token/remove/${store.state.device_token}`
            })
        }catch(err){
            return false;
        }
    }
}

export {profileAPIs,likeAPIs,matchAPIs,deviceTokenAPIs};