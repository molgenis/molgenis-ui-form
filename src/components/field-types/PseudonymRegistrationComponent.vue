<template>
  <validate
    :class="{ 'mlg-was-validated': wasValidated }"
    :state="fieldState"
    :custom="{
      validate: isValid,
      expression: !hasExpressionError
    }"
    :debounce="inputDebounceTime"
  >
    <div class="form-group">
        <div :class="{'border border-primary bg-light p-2':showForm}">
            <label :for="field.id">{{ field.label }}</label>
            <div v-if="error!=''">
                <p class='text-danger'>{{error}}</p>
                <button id="pseudonym-again-btn" class="btn btn-danger" type="reset" @click.prevent="reset()">Try again</button>
            </div>
            <div v-else-if="loaded || localValue!=null">
                <div v-if="localValue!=null">
                  <div class="input-group mb-3">
                    <input
                      :id="field.id"
                      :value="localValue"
                      type="text"
                      :name="field.id"
                      class="form-control"
                      :class="{ 'is-invalid': wasValidated && fieldState.$invalid }"
                      :aria-describedby="field.id + '-description'"
                      :disabled="true"
                    />
                    <div class="input-group-append">
                      <button id="clipboard-btn" class="btn btn-outline-secondary" :class="{'btn-outline-success':sendToClipboard}" @click.prevent="idToClipboard()">
                        {{ sendToClipboard ? "Copied to clipboard" : "Copy to clipboard" }}
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div v-if="!showForm">
                      <div v-if="config.GeneratedTokenDescription"><small>{{config.GeneratedTokenDescription}}</small></div>
                      <button id="pseudonym-create-btn"  ype="button" class="btn btn-primary" @click='showForm = true'>Create a {{config.GeneratedTokenName}}</button>
                  </div>
                  <div v-else>
                      <p v-if="config.GeneratedTokenDescription"><small>{{config.GeneratedTokenDescription}}</small></p>
                      <form-component
                          id="create-pseudonym-registration-id"
                          :formFields="formFields"
                          :initialFormData="formData"
                          :formState="formState"
                          :options="options"
                          @valueChange="onValueChanged">
                      </form-component>
                      <button id="pseudonym-cancel-btn" class="btn btn-secondary" type="reset" @click.prevent="showForm = false">Cancel</button>
                      <button id="pseudonym-save-btn" class="btn btn-primary" type="submit" @click.prevent="onSubmitPseudonymRegistration">Generate</button>
                  </div>
                </div>
            </div>
            <div v-else>
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <div>Requesting additional information...</div>
            </div>
            <div v-if="fieldState && fieldState.$dirty" class="validationMessage">
                {{ 'ui-form:form_invalid_input' | i18n }}
            </div>

            <description :id="field.id" :text="field.description" />

            <form-field-messages
                :field-id="field.id"
                :type="field.type"
                :expressionError="expressionErrorMsg"
                :field-state="fieldState"
            >
            </form-field-messages>
        </div>
    </div>
  </validate>
</template>

<style scoped>
.vf-field-invalid .btn.btn-primary, .vf-field-invalid .border.border-primary{
  border:1px solid #dc3545 !important;
}
.mlg-was-validated .form-control:invalid {
  border-color: #dc3545;
}
.mlg-was-validated .form-control:invalid:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
.validationMessage {
  display: none;
}
input:invalid + .validationMessage {
  display: block;
  width: 100%;
  margin-top: .25rem;
  font-size: 80%;
  color: #dc3545;
}
</style>

<script>
import VueForm from 'vue-form'
import { FormField } from '../../flow.types'
import FormFieldMessages from '../FormFieldMessages'
import Description from '../Description'
import pseudonymRegistration from '../../util/helpers/pseudonymRegistration'
let debounceTime = 500

export default {
  name: 'PseudonymRegistrationComponent',
  components: {
    FormFieldMessages,
    Description,
    // Fix for Circular Reference
    // see: https://stackoverflow.com/questions/49154490/did-you-register-the-component-correctly-for-recursive-components-make-sure-to
    FormComponent: () => import('../FormComponent.vue')
  },
  props: {
    value: {
      // The value representing a id
      type: String,
      required: false
    },
    field: {
      type: FormField,
      required: true
    },
    fieldState: {
      type: Object,
      required: false
    },
    isValid: {
      type: Boolean,
      default: true
    },
    isUnique: {
      type: Function,
      default: () => true
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    hasExpressionError: {
      type: Boolean,
      default: false
    },
    expressionErrorMsg: {
      type: String,
      default: ''
    },
    inputDebounceTime: {
      type: Number,
      default: debounceTime
    }
  },
  mixins: [VueForm],
  data () {
    return {
      // Store a local value to prevent changing the parent state
      localValue: this.value,
      showForm: false,
      config: {},
      loaded: false,
      error: '',
      sendToClipboard: false,

      // form
      formFields: [
        {
          id: 'umcgnr',
          label: 'UMCG Number',
          type: 'string',
          visible: () => true,
          required: () => true,
          validate: () => true
        }
      ],
      formState: {},
      formData: {},
      options: {
        showEyeButton: false
      }
    }
  },
  methods: {
    onValueChanged (formData) {
      this.formData = formData
    },
    idToClipboard () {
      navigator.clipboard.writeText(this.localValue).then(() => {
        this.sendToClipboard = true
      }, () => {})
    },
    onSubmitPseudonymRegistration () {
      // TODO: trigger validation
      this.showForm = false
      const options = {
        body: JSON.stringify(this.formData)
      }
      pseudonymRegistration.submitPseudonymRegistration(this.config, options, this.formData.umcgnr).then(id => {
        this.localValue = id
        this.idToClipboard()
        console.log('ok')
      }, error => {
        console.log('err', error)
        this.error = error
      })
    },
    requestConfig () {
      this.loadingFailed = false
      // Get extra configuration information
      pseudonymRegistration.requestConfiguration(this.field.id).then(response => {
        if (response.items.count === 0) {
          this.error = 'Error: Please contact a system administator'
          return
        }
        this.config = response.items[0]
        this.loaded = true
      }, () => {
        this.error = 'Connection error. Please check you internet connection or contact a system administator'
      })
    },
    reset () {
      this.showForm = false
      this.loaded = false
      this.error = ''
      this.sendToClipboard = false
      this.requestConfig()
    }
  },
  watch: {
    localValue (value) {
      this.$emit('input', value)
    }
  },
  computed: {
    wasValidated () {
      return (
        this.fieldState &&
        (this.fieldState.$touched ||
          this.fieldState.$submitted ||
          this.fieldState.$dirty)
      )
    }
  },
  created () {
    this.requestConfig()
  }
}
</script>
