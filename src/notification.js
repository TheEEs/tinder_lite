import store from './store';
import {Plugins} from "@capacitor/core"
const {PushNotifications} = Plugins;
//import Noty from "noty";

PushNotifications.register();

PushNotifications.addListener("registration",(token)=>{
    store.commit("set_device_token",token.value)
});

PushNotifications.addListener("registrationError" ,()=> {
    store.commit("set_device_token",null)
})

PushNotifications.addListener("pushNotificationReceived",notification => {
    alert(JSON.stringify(notification))
})

PushNotifications.addListener("pushNotificationActionPerformed",action => {
    alert(JSON.stringify(action))
})
