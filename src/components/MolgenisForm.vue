<template>
    <vue-form :state="formState" @submit.prevent="onSubmit(formData)">
        <div class="text-right hide-option-fields-btn-container">
            <button type="button" class="btn btn-sm btn-outline-secondary"
                    @click="hideOptionalFields = !hideOptionalFields">
                <i class="fa fa-eye"></i>
            </button>
        </div>

        <fieldset :disabled="readOnlyForm" v-for="field in fields" v-show="show(field)">
            <checkbox-field v-if="field.type === 'checkboxes'"
                            v-model="data[field.id]"
                            :field="field"
                            :required="isRequired(field)"
                            :state="formState[field.id]"></checkbox-field>

            <date-time-field v-else-if="field.type === 'date' || field.type === 'date-time'"
                             v-model="data[field.id]"
                             :field="field"
                             :required="isRequired(field)"
                             :state="formState[field.id]"></date-time-field>

            <file-field v-else-if="field.type === 'file'"
                        v-model="data[field.id]"
                        :field="field"
                        :required="isRequired(field)"
                        :state="formState[field.id]"></file-field>

            <radios-field v-else-if="field.type === 'radios'"
                          v-model="data[field.id]"
                          :field="field"
                          :required="isRequired(field)"
                          :state="formState[field.id]"></radios-field>

            <select-field v-else-if="field.type === 'select'"
                          v-model="data[field.id]"
                          :field="field"
                          :required="isRequired(field)"
                          :state="formState[field.id]"></select-field>


            <text-area-field v-else-if="field.type === 'text-area'"
                             v-model="data[field.id]"
                             :field="field"
                             :required="isRequired(field)"
                             :state="formState[field.id]"></text-area-field>

            <typed-form-field v-else
                         v-model="data[field.id]"
                         :field="field"
                         :required="isRequired(field)"
                         :state="formState[field.id]"></typed-form-field>
        </fieldset>

        <div class="form-buttons text-right">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" @click="onCancel" class="btn btn-light">Cancel</button>
        </div>
    </vue-form>
</template>

<style>
    .invalid-message {
        color: #dc3545;
    }

    .hide-option-fields-btn-container {
        margin-bottom: 1rem;
    }

    .required-field > label::after {
        content: '*';
    }
</style>

<script>
  import fields from './field-components'
  import utils from '../utils'

  export default {
    name: 'molgenis-form',
    props: ['id', 'type', 'schema', 'data', 'readOnlyForm', 'onSubmit', 'onCancel'],
    data () {
      return {
        formState: {},
        formSchema: {},
        formData: {},
        hideOptionalFields: false
      }
    },
    methods: {
      isRequired (field) {
        let required = field.required
        if (typeof required === 'function') {
          required = required(this.data)
        }
        return required
      },
      show (field) {
        let visible = field.visible
        if (typeof visible === 'function') {
          visible = visible(this.data)
        }
        return (!this.hideOptionalFields || this.isRequired(field)) && visible
      }
    },
    computed: {
      fields () {
        return Object.keys(this.formSchema).map(fieldId => {
          return this.formSchema[fieldId]
        })
      }
    },
    mounted () {
      /* If the type is a molgenis-entity, generate a formSchema object, else just use the supplied schema */
      this.formSchema = this.type === 'molgenis-entity' ? utils.generateFormSchema(this.schema) : this.schema

      /* If the type is a molgenis-entity, generate a formData object, else just use the supplied data */
      this.formData = this.type === 'molgenis-entity' ? utils.generateFormData(Object.keys(this.formSchema), this.data) : this.data
    },
    components: {
      'checkbox-field': fields.CheckboxField,
      'date-time-field': fields.DateTimeField,
      'file-field': fields.FileField,
      'radios-field': fields.RadiosField,
      'select-field': fields.SelectField,
      'text-area-field': fields.TextAreaField,
      'typed-form-field': fields.TypedFormField
    }
  }
</script>