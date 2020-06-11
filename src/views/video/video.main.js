/* jshint esversion: 6 */
import Vue from 'vue';
import store from '@/store/index.js';
import videoApp from './videoApp.vue';

import '@/assets/css/iconfont.js'

import VueI18n from 'vue-i18n'


// video 组件
import myVideo  from "@/assets/js/myVideo.js"
Vue.use(myVideo);
import collectArticle from "@/assets/js/collect.min.js"
Vue.use(collectArticle);

Vue.use(VueI18n)
Vue.config.productionTip = false;

const messages = {
    zh: {
        message: {
            hello: '好好'
        }
    },
    en: {
        message: {
            hello: 'good good study, day day up!'
        }
    }
}

const i18n = new VueI18n({
    locale: window.InitData.EnlishLan, // 语言标识
    messages
})

new Vue({
  store,
  i18n,
  // router,
  render: h => h(videoApp),
}).$mount('#app');
