<template>
  <vue-form :id="id" :state="state">
    <fieldset v-for="field in schema.fields">

      <!-- Render checkbox field -->
      <template v-if="field.type === 'checkbox'">
        <checkbox-field-component
          v-model="data[field.id]"
          :field="field"
          :state="state[field.id]"
          :validate="validate">
        </checkbox-field-component>
      </template>

      <!-- Render number field -->
      <template v-if="field.type === 'number'">
        <number-field-component
          v-model="data[field.id]"
          :field="field"
          :state="state[field.id]"
          :validate="validate">
        </number-field-component>
      </template>


      <!-- Render radio field -->
      <template v-if="field.type === 'radio'">
        <radio-field-component
          v-model="data[field.id]"
          :field="field"
          :state="state[field.id]"
          :validate="validate">
        </radio-field-component>
      </template>

      <!-- Render text field -->
      <template v-else-if="field.type === 'text'">
        <text-field-component
          v-model="data[field.id]"
          :field="field"
          :state="state[field.id]"
          :validate="validate">
        </text-field-component>
      </template>

    </fieldset>
  </vue-form>
</template>

<script>
  import VueForm from 'vue-form'

  import CheckboxFieldComponent from './field-types/CheckboxFieldComponent'
  import NumberFieldComponent from './field-types/NumberFieldComponent'
  import RadioFieldComponent from './field-types/RadioFieldComponent'
  import TextFieldComponent from './field-types/TextFieldComponent'

  export default {
    name: 'FormComponent',
    mixins: [VueForm],
    props: {
      id: {
        type: String,
        required: true
      },
      schema: {
        type: Object,
        required: true
      },
      data: {
        type: Object,
        required: false,
        default: () => ({})
      }
    },
    data () {
      return {
        state: {}
      }
    },
    methods: {
      validate (field) {
        let valid = true

        if (field.validators) {
          field.validators.forEach(validator => {
            // validate with all the data in the form
            valid = validator(this.data)
          })
        }
        return valid
      }
    },
    components: {
      CheckboxFieldComponent,
      NumberFieldComponent,
      RadioFieldComponent,
      TextFieldComponent
    }
  }
</script>
