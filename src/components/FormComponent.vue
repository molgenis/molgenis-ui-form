<template>
  <form :id="id" @submit.prevent="validateBeforeSubmit" @reset.prevent="hooks.onCancel">
    <fieldset v-for="field in schema.fields">

      <!-- Render checkbox field -->
      <template v-if="field.type === 'checkbox'">
        <checkbox-field-component
          v-model="data[field.id]"
          :field="field"
          @dataChange="hooks.onValueChanged(data)">
        </checkbox-field-component>
      </template>

      <!-- Render radio field -->
      <template v-else-if="field.type === 'radio'">
        <radio-field-component
          v-model="data[field.id]"
          :field="field"
          @dataChange="hooks.onValueChanged(data)">
        </radio-field-component>
      </template>

      <!-- Render text area field -->
      <template v-else-if="field.type === 'text-area'">
        <text-area-field-component
          v-model="data[field.id]"
          :field="field"
          @dataChange="hooks.onValueChanged(data)">
        </text-area-field-component>
      </template>

      <!-- Render email, url, password, number, and text fields -->
      <template v-else>
        <typed-field-component
          v-model="data[field.id]"
          :field="field"
          @dataChange="hooks.onValueChanged(data)">
        </typed-field-component>
      </template>

    </fieldset>
  </form>
</template>

<script>
  import CheckboxFieldComponent from './field-types/CheckboxFieldComponent'
  import RadioFieldComponent from './field-types/RadioFieldComponent'
  import TextAreaFieldComponent from './field-types/TextAreaFieldComponent'
  import TypedFieldComponent from './field-types/TypedFieldComponent'

  import { FormHook } from '../flow.types'

  import Vue from 'vue'
  import VeeValidate from 'vee-validate'

  // Register as a global plugin (mixin not available)
  Vue.use(VeeValidate)

  export default {
    name: 'FormComponent',
    props: {
      id: {
        type: String,
        required: true
      },
      schema: {
        type: Object,
        required: true,
        validator: (schema) => {
          const fieldIds = new Set()

          const notUnique = schema.fields.some(field => {
            return fieldIds.size === fieldIds.add(field.id).size
          })

          if (notUnique) {
            console.log('Identifiers for fields inside your schema must be unique!')
            return false
          }
          return true
        }
      },
      data: {
        type: Object,
        required: false,
        default: () => ({})
      },
      hooks: {
        type: FormHook,
        required: true
      }
    },
    methods: {
      validateBeforeSubmit () {
        // Run complete validation on form before submit
        this.$validator.validateAll().then(valid => {
          if (valid) {
            // If form is valid, call onSubmit hook with form data
            this.hooks.onSubmit(this.data)
          } else {
            // Do something with focus?? Or message...
          }
        })
      }
    },
    mounted () {
      const formData = this.data
      this.schema.fields.forEach(formField => {
        // Create a custom validation rule for every field in the form
        VeeValidate.Validator.extend('validate-' + formField.id, {
          getMessage () {
            return formField.fieldValidation.message
          },
          validate () {
            return formField.fieldValidation.validate(formData)
          }
        })
      })
    },
    components: {
      CheckboxFieldComponent,
      RadioFieldComponent,
      TextAreaFieldComponent,
      TypedFieldComponent
    }
  }
</script>
