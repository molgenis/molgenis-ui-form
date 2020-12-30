<template>
  <div>
    <div class="row mb-1">
      <div class="col-sm">
        <div class="row">
          <div class="col-sm">
            <div class="card">
              <h5 class="card-header text-center bg-info">Mapper Error demo</h5>
              <div class="card-body">
                <form-component
                  id="mapper-error-example"
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
          :field-settings="formFields"
          :field-data="formData"
        ></model-settings>
      </div>
    </div>
  </div>
</template>

<script>
import { EntityToFormMapper, FormComponent } from '@/molgenisUiForm'
import ModelSettings from '../components/ModelSettings'

export default {
  name: 'mapper-error-example',
  components: {
    ModelSettings,
    FormComponent
  },
  data () {
    return {
      formOptions: {
        showEyeButton: true
      },
      formFields: [],
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
  },
  created () {
    const metadata = {
      href: '/api/v2/validation-error',
      hrefCollection: '/api/v2/validation-error',
      name: 'validation-error',
      label: 'Demo',
      description: 'Form with 2 fields',
      idAttribute: '',
      attributes: [
        {
          name: 'fieldA',
          label: 'Field A',
          description: 'this is field a',
          fieldType: 'STRING',
          attributes: [],
          auto: false,
          href: '/api/v2/validation-error/meta/id',
          isAggregatable: false,
          labelAttribute: false,
          lookupAttribute: false,
          nillable: false,
          readOnly: false,
          unique: false,
          visible: true
        },
        {
          name: 'fieldB',
          label: 'Field B',
          description: 'This field contains a visibleExpression with a syntax error',
          fieldType: 'STRING',
          href: '/api/v2/validation-error/meta/string',
          attributes: [],
          auto: false,
          nillable: true,
          readOnly: false,
          labelAttribute: true,
          lookupAttribute: true,
          isAggregatable: false,
          unique: false,
          visible: true,
          visibleExpression: '$("fieldA").value() == null || ($("fieldA").value() === "foo"'
        }
      ]
    }
    const items = { fieldA: 'aaa', fieldB: 'bbb' }
    const form = EntityToFormMapper.generateForm(metadata, items)
    this.formFields = form.formFields
    this.formData = form.formData
  }
}
</script>
