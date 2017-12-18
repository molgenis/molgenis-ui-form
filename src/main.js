// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FormDemo from './FormDemo'
import VueForm from 'vue-form'

Vue.config.productionTip = false

Vue.use(VueForm)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<FormDemo/>',
  components: { FormDemo }
})
