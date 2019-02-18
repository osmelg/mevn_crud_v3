import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
import VueSweetalert2 from 'vue-sweetalert2';

Vue.config.productionTip = false
// Middlewares
  Vue.use(VueSweetalert2);
  Vue.use(VeeValidate);
// Validaciones VeeValidate
  const dictionary = {
    en:{
      custom: {
        nombre: {
          required:'Type a name'
        },
        email: {
          email:'Type a valid email',
          required:'Type a email',
        },
        password: {
          required:'Type a password',
          alpha_num:'Password min 2 digits'
        }
      }    
    }
  };
  Validator.localize(dictionary);
  const validator = new Validator();
  validator.localize('en'); 

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')