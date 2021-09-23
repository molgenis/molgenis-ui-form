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
            <div v-if="loaded || localValue!=null">
                <div v-if="localValue!=null">

                  <div class="input-group mb-3">
                    <input
                      :id="field.id"
                      :value="localValue"
                      :type="text"
                      :name="field.id"
                      class="form-control"
                      :class="{ 'is-invalid': wasValidated && fieldState.$invalid }"
                      :aria-describedby="field.id + '-description'"
                      :disabled="true"
                    />
                    <div class="input-group-append">
                      <button id="cancel-btn" class="btn btn-outline-secondary" :class="{'btn-outline-success':sendToClipboard}" @click.prevent="idToClipboard()">
                        {{ sendToClipboard ? "Copied to clipboard" : "Copy to clipboard" }}
                      </button>
                    </div>
                  </div>

                </div>
                <div v-else>
                  <div v-if="!showForm">
                      <div v-if="config.GeneratedTokenDescription"><small>{{config.GeneratedTokenDescription}}</small></div>
                      <button type="button" class="btn btn-primary" @click='showForm = true'>Create a {{config.GeneratedTokenName}}</button>
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
                      <button id="cancel-btn" class="btn btn-secondary" type="reset" @click.prevent="showForm = false">Cancel</button>
                      <button id="save-btn" class="btn btn-primary" type="submit" @click.prevent="onSubmitPseudonymRegistration">Generate</button>
                  </div>
                </div>
            </div>
            <div v-else>
                <div v-if="loadingFailed">
                    <div class='text-danger'>Connection error</div>
                    <button id="cancel-btn" class="btn btn-danger" type="reset" @click.prevent="requestConfig()">Try again</button>
                </div>
                <div v-else>
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <div>Requesting additional information...</div>
                </div>
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
import api from '@molgenis/molgenis-api-client'

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
      loadingFailed: false,
      sendToClipboard: false,

      // form
      formFields: [
        {
          id: 'UMCG_NR',
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
      })
    },
    onSubmitPseudonymRegistration () {
      this.showForm = false
      console.log(this.formData)
      const options = {
        body: JSON.stringify(this.formData)
      }
      api.post('/api/data/koppeltabel', options).then(response => {
        if (response.status === 201) {
          // We generated a new id, lets get it  and store it in the create form
          api.get(`/api/data/koppeltabel?q=UMCG_NR=like=${this.formData.UMCG_NR}`).then(response => {
            console.log(response.items[0].data.id)
            this.localValue = response.items[0].data.id
            this.idToClipboard()
          }, (error) => {
            console.error(error)
          })
        }
      }, error => {
        console.log(error)
        // on fail
        // already exist? tel user
        // other error? tell user
      })
    },
    requestConfig () {
      this.loadingFailed = false
      // Get extra configuration information
      api.get(`/api/v2/PseudonymRegistrationConfig?q=id=like=${this.field.id}`).then(response => {
        if (response.items.count === 0) {
          this.loadingFailed = true
          return
        }
        this.config = response.items[0]
        this.loaded = true
        console.log(this.config)
      }, () => {
        this.loadingFailed = true
      })
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
    //
  /*
    api.get('/api/v2/koppeltabel?attrs=~id,~lbl,&num=20').then(response => {
      console.log(response)
    })
  */
  }
}
</script>
