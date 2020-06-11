/* jshint esversion: 6 */
import Vue from 'vue';
import store from '@/store/index.js';
import PdfApp from './PDFRead.vue';
import '@/assets/css/iconfont.js'
import VueI18n from 'vue-i18n'
import loginReg from "login"
import tip  from "tip"
import collectArticle from "@/assets/js/collect.min.js"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import quote from "quote";
// import vueCropper from 'vue-cropper' // 截图插件

// Vue.use(vueCropper);
Vue.use(ElementUI);
Vue.use(collectArticle);
Vue.use(tip);
Vue.use(loginReg);
Vue.use(quote);

Vue.use(VueI18n);


Vue.config.productionTip = false;

const messages = {
    zh: {
        message: {
            hello: '中文'
        }
    },
    en: {
        message: {
            hello: 'English'
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
  render: h => h(PdfApp),
}).$mount('#app');
