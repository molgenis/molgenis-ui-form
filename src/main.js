import Vue from 'vue'
import App from './App.vue'
import VueForm from 'vue-form'

Vue.use(VueForm)
new Vue({
  el: '#app',
  template: '<App />',
  components: {App}
})