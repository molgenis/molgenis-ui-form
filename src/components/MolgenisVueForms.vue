<template>
    <vue-form :state="state" @submit.prevent="options.onSubmit(data)">

        <div class="text-right hide-option-fields-btn-container">
            <button type="button" class="btn btn-sm btn-outline-secondary"
                    @click="hideOptionalFields = !hideOptionalFields">
                <i class="fa fa-eye"></i>
            </button>
        </div>

        <fieldset :disabled="options.readonly" v-for="field in fields" :key="field.id" v-show="show(field)">
            <checkbox-field v-if="field.type === 'checkboxes'"
                            v-model="data[field.id]"
                            :field="field"
                            :required="isRequired(field)"
                            :state="state[field.id]"></checkbox-field>

            <date-time-field v-else-if="field.type === 'date' || field.type === 'date-time'"
                             v-model="data[field.id]"
                             :field="field"
                             :required="isRequired(field)"
                             :state="state[field.id]"></date-time-field>

            <file-field v-else-if="field.type === 'file'"
                        v-model="data[field.id]"
                        :field="field"
                        :required="isRequired(field)"
                        :state="state[field.id]"></file-field>

            <radios-field v-else-if="field.type === 'radios'"
                          v-model="data[field.id]"
                          :field="field"
                          :required="isRequired(field)"
                          :state="state[field.id]"></radios-field>

            <select-field v-else-if="field.type === 'select'"
                          v-model="data[field.id]"
                          :field="field"
                          :required="isRequired(field)"
                          :state="state[field.id]"></select-field>


            <text-area-field v-else-if="field.type === 'text-area'"
                             v-model="data[field.id]"
                             :field="field"
                             :required="isRequired(field)"
                             :state="state[field.id]"></text-area-field>

            <typed-form-field v-else
                         v-model="data[field.id]"
                         :field="field"
                         :required="isRequired(field)"
                         :state="state[field.id]"></typed-form-field>
        </fieldset>

        <div class="form-buttons text-right">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" @click="options.onCancel" class="btn btn-light">Cancel</button>
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

  export default {
    name: 'vue-data-form',
    props: ['id', 'fields', 'data', 'options'],
    data () {
      return {
        state: {},
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