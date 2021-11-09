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
import { expressionValidationFormFields } from '../../util/ExpressionValidationFormFields'

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
      formFields: expressionValidationFormFields,
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
