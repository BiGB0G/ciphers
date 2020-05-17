import Vue from 'vue'
import App from './App.vue'
import ElementsUI from 'element-ui';
import {Loading} from 'element-ui';
import {Notification} from 'element-ui';
import {MessageBox} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router/router';

// Vue.use(Element);
Vue.use(ElementsUI, Loading, Notification, MessageBox);

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
