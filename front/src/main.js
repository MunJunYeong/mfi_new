import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios';
import VueCookies from "vue-cookies";

Vue.config.productionTip = false
Vue.prototype.$http = axios;

//이걸로 this.$cookie 안되는 ?
Vue.prototype.$cookie = VueCookies;
Vue.use(VueCookies);

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    config.withCredentials = true;
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

//토큰 유효성 검사
let token = localStorage.getItem('accessToken');
if(token !== null){
  store.dispatch('auth_vertify_token', token);
}

// cookie가 없을 경우에 쿠키 생성
if (!VueCookies.isKey("visitor")){
  store.dispatch('create_visitor');
}
console.log(VueCookies.isKey('visitor'));

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
