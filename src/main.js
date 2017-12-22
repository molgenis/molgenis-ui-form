import Vue from 'vue'
import FormDemo from './FormDemo'
import VueForm from 'vue-form'

Vue.use(VueForm)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#form-demo',
  template: '<FormDemo/>',
  components: {FormDemo}
})
