/* jshint esversion: 6 */
import Vue from 'vue';
import App from '@/components/mobile/mobileApp';
import '@/assets/css/iconfont.js'
require("layui-layer");

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
