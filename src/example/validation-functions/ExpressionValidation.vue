<template>
  <div>
    <div class="row mb-1">
      <div class="col-sm">
        <div class="row">
          <div class="col-sm">
            <div class="card">
              <h5 class="card-header text-center bg-info">
                Empty Expression Demo
              </h5>
              <div class="card-body">
                <form-component
                  id="expression-validation-error-list"
                  :options="formOptions"
                  :formFields="formFields"
                  :initialFormData="formData"
                  :formState="formState"
                  @valueChange="onValueChanged"
                >
                </form-component>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm">
        <model-settings
          :field-settings="formFields[0]"
          :field-data="formData"
        ></model-settings>
      </div>
    </div>
  </div>
</template>

<script>
import { FormComponent } from '../../molgenisUiForm'
import ModelSettings from '../components/ModelSettings'

export default {
  name: 'expression-validation-error',
  components: {
    ModelSettings,
    FormComponent
  },
  data () {
    return {
      formOptions: {
        showEyeButton: false
      },
      formFields: [
        {
          id: 'expression-validation-error-field',
          label: 'Some Field',
          description: 'Type "1-234" to remove the error',
          type: 'string',
          visible: (formData) => {
            if (formData['expression-validation-error-field'] !== '1-234') {
              throw new Error('input not equal 1-234')
            } else {
              return true
            }
          },
          required: () => false,
          validate: () => true
        },
        {
          id: 'expression-validation-error-field-other',
          label: 'Some other Field',
          description: 'Type "1-234" to remove the error',
          type: 'string',
          visible: (formData) => {
            if (formData['expression-validation-error-field'] !== '1-234') {
              throw new Error('input not equal 1-234')
            } else {
              return true
            }
          },
          required: () => false,
          validate: () => true
        }
      ],
      formState: {},
      formData: {
        'expression-validation-error-field': ''
      }
    }
  },
  methods: {
    onValueChanged (formData) {
      this.formData = formData
    }
  },
  filters: {
    pretty (value) {
      return JSON.stringify(value, null, 2)
    }
  }
}
</script>
