<template>
  <div>
    <div class="row mb-1">
      <div class="col-sm">
        <div class="card">
          <h5 class="card-header text-center bg-info">Compound demo</h5>
          <div class="card-body">
            <form-component
              id="compound-form-example"
              :options="formOptions"
              :formFields="formFields"
              :initialFormData="formData"
              :formState="formState"
              @valueChange="onValueChanged"
            ></form-component>
          </div>
        </div>
      </div>

      <div class="col-sm">
        <model-settings
        :field-settings="formFields[0]"
        :field-data="formData"
        :form-state="formState"
        ></model-settings>
      </div>
    </div>
  </div>
</template>

<script>
import { FormComponent } from '../../molgenisUiForm'
import ModelSettings from '../components/ModelSettings'

export default {
  name: 'compound-example',
  components: {
    ModelSettings,
    FormComponent
  },
  data () {
    return {
      formOptions: {
        showEyeButton: false,
        allowAddingOptions: true
      },
      formFields: [
        {
          id: 'compound-example',
          label: 'compound',
          description: 'A field group',
          type: 'field-group',
          children: [
            {
              id: 'compound-string',
              label: 'compound string',
              type: 'text',
              visible: () => true,
              required: () => false,
              validate: () => true
            },
            {
              id: 'compound-multi-select',
              label: 'compound multi select',
              type: 'multi-select',
              options: () =>
                Promise.resolve([
                  { id: '1', label: 'Option 1', value: 'val-1' },
                  { id: '2', label: 'Option 2', value: 'val-2' },
                  { id: '3', label: 'Option 3', value: 'val-3' }
                ]),
              visible: () => true,
              required: () => false,
              validate: () => true
            }
          ],
          visible: () => true,
          required: () => false,
          validate: () => true
        }
      ],
      formState: {},
      formData: {}
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
