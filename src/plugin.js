import FormComponent from './components/FormComponent.vue'
import VueForm from 'vue-form'

// When the FormComponent library is imported:
// 1. VueForm will be globally installed
// 2. The FormComponent will be registered
module.exports = {
  install: function (Vue, options) {
    Vue.use(VueForm)
    Vue.component('molgenis-ui-form', FormComponent)
  }
}
