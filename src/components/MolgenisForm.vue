<template>
    <vue-form :state="formState" @submit.prevent="onSubmit(formData)">
        <div class="text-right hide-option-fields-btn-container">
            <button type="button" class="btn btn-sm btn-outline-secondary"
                    @click="hideOptionalFields = !hideOptionalFields">
                <i class="fa fa-eye"></i>
            </button>
        </div>

        <fieldset :disabled="readOnlyForm" v-for="field in fields">
            <checkbox-field v-if="fieldType(field) === 'checkboxes'"
                            v-show="show(field)"
                            :required="isRequired(field)"
                            :field="formSchema[field]"
                            v-model="formData[field]"
                            :formState="formState"
                            :fieldClassName="fieldClassName"></checkbox-field>

            <date-field v-else-if="fieldType(field) === 'date'"
                        v-show="show(field)"
                        :required="isRequired(field)"
                        :field="formSchema[field]"
                        v-model="formData[field]"
                        :formState="formState"
                        :fieldClassName="fieldClassName"></date-field>

            <date-time-field v-else-if="fieldType(field) === 'date-time'"
                             v-show="show(field)"
                             :required="isRequired(field)"
                             :field="formSchema[field]"
                             v-model="formData[field]"
                             :formState="formState"
                             :fieldClassName="fieldClassName"></date-time-field>

            <file-field v-else-if="fieldType(field) === 'file'"
                        v-show="show(field)"
                        :required="isRequired(field)"
                        :field="formSchema[field]"
                        v-model="formData[field]"
                        :formState="formState"
                        :fieldClassName="fieldClassName"></file-field>

            <radios-field v-else-if="fieldType(field) === 'radios'"
                          v-show="show(field)"
                          :required="isRequired(field)"
                          :field="formSchema[field]"
                          v-model="formData[field]"
                          :formState="formState"
                          :fieldClassName="fieldClassName"></radios-field>

            <select-field v-else-if="fieldType(field) === 'select'"
                          v-show="show(field)"
                          :required="isRequired(field)"
                          :field="formSchema[field]"
                          v-model="formData[field]"
                          :formState="formState"
                          :fieldClassName="fieldClassName"></select-field>


            <text-area-field v-else-if="fieldType(field) === 'text-area'"
                             v-show="show(field)"
                             :required="isRequired(field)"
                             :field="formSchema[field]"
                             v-model="formData[field]"
                             :formState="formState"
                             :fieldClassName="fieldClassName"></text-area-field>

            <input-field v-else
                         v-show="show(field)"
                         :required="isRequired(field)"
                         :field="formSchema[field]"
                         v-model="formData[field]"
                         :formState="formState"
                         :fieldClassName="fieldClassName"></input-field>
        </fieldset>

        <div class="form-buttons text-right">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" @click="onCancel" class="btn btn-light">Cancel</button>
        </div>
    </vue-form>
</template>

<style>
    .hide-option-fields-btn-container {
        margin-bottom: 1rem;
    }

    .invalid-message {
        color: #dc3545;
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
      fieldClassName (field) {
        /* Return is-invalid as a class when the field is invalid */
        return field && (field.$touched || field.$submitted) && field.$invalid ? 'is-invalid' : ''
      },
      fieldType (field) {
        return this.formSchema[field].type
      },
      show (field) {
        let visible = this.formSchema[field].visible
        if (typeof visible === 'function') {
          visible = visible(this.formData)
        }
        return (!this.hideOptionalFields || this.isRequired(field)) && visible
      },
      isRequired (field) {
        let required = this.formSchema[field].required
        if (typeof required === 'function') {
          required = required(this.formData)
        }
        return required
      }
    },
    computed: {
      fields () {
        return Object.keys(this.formSchema)
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
      'date-field': fields.DateField,
      'date-time-field': fields.DateTimeField,
      'file-field': fields.FileField,
      'input-field': fields.InputField,
      'radios-field': fields.RadiosField,
      'select-field': fields.SelectField,
      'text-area-field': fields.TextAreaField
    }
  }
</script>