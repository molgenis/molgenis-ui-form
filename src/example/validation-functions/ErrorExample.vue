<template>
  <div>
    <div class="row mb-1">
      <div class="col-sm">
        <div class="row">
          <div class="col-sm">
            <div class="card">
              <h5 class="card-header text-center bg-info">Error demo</h5>
              <div class="card-body">
                <form-component
                  id="error-example"
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
  name: 'error-example',
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
          id: 'error-example-field',
          label: 'Some Field',
          description: 'Type "error" to trigger the error',
          type: 'string',
          visible: (formData) => {
            if (formData['error-example-field'] === 'error') {
              throw new Error('error from visible expression')
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
        'error-example-field': 'test'
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
