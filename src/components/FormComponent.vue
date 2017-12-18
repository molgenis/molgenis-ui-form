<template>
  <vue-form :state="state">
    <text-field-component v-model="text" :state="state"></text-field-component>
  </vue-form>
</template>

<script>
  import VueForm from 'vue-form'
  import TextFieldComponent from './form-field-components/TextFieldComponent'

  export default {
    name: 'form-component',
    data () {
      return {
        state: {},
        text: ''
      }
    },
    mixins: [VueForm],
    components: {
      TextFieldComponent
    }
  }
</script>
