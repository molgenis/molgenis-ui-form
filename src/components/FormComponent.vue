<template>
  <vue-form :state="state">
    <text-field-component v-model="text" :state="state"></text-field-component>
  </vue-form>
</template>

<script>
  import TextFieldComponent from './form-field-components/TextFieldComponent'

  export default {
    name: 'form-component',
    data () {
      return {
        state: {},
        text: ''
      }
    },
    components: {
      TextFieldComponent
    }
  }
</script>
