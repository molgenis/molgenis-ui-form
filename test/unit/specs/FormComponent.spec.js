import Vue from 'vue'
import VueForm from 'vue-form'
import FormComponent from '@/components/FormComponent'

describe('FormComponent unit tests', () => {
  it('should load the component with "FormComponent" as a name', () => {
    expect(FormComponent.name).to.equal('FormComponent')
  })

  it('should have the correct props listed', () => {
    const props = FormComponent.props
    expect(typeof props.id).to.equal('object')
    expect(typeof props.schema).to.equal('object')
    expect(typeof props.data).to.equal('object')
  })

  it('should have the correct default data', () => {
    expect(typeof FormComponent.data).to.equal('function')
    const data = FormComponent.data()
    expect(data.state).to.deep.equal({})
  })

  it('renders correctly with minimal props', () => {
    const Constructor = Vue.extend(FormComponent)
    const propsData = {id: 'test-form', schema: {}}
    const vm = new Constructor({propsData: propsData, mixins: [VueForm]}).$mount()
    expect(vm.$el.id).to.equal('test-form')
  })

  it('renders correctly with real props', () => {
    const Constructor = Vue.extend(FormComponent)
    const schema = {
      fields: [
        {
          type: 'text',
          id: 'text-field',
          label: 'Text field',
          description: 'This is a cool text field',
          visible: true,
          required: true,
          disabled: false,
          validators: [
            (data) => {
              const value = data['text-field']
              return value ? value.indexOf('test') !== -1 : true
            }
          ]
        },
        {
          type: 'radio',
          id: 'radio-field',
          label: 'Radio field',
          description: 'This is a nice radio button selection',
          visible: true,
          required: true,
          disabled: false,
          options: () => {
            return [
              {
                id: '1',
                label: 'Option 1',
                value: '1'
              },
              {
                id: '2',
                label: 'Option 2',
                value: '2'
              },
              {
                id: '3',
                label: 'Option 3',
                value: '3'
              }
            ]
          }
        },
        {
          type: 'checkbox',
          id: 'checkbox-field',
          label: 'Checkbox field',
          description: 'This is a nice Checkbox selection',
          visible: true,
          required: true,
          disabled: false,
          validators: [],
          options: () => {
            return [
              {
                id: '1',
                label: 'Option 1',
                value: '1'
              },
              {
                id: '2',
                label: 'Option 2',
                value: '2'
              },
              {
                id: '3',
                label: 'Option 3',
                value: '3'
              }
            ]
          }
        }
      ]
    }

    const propsData = {id: 'test-form', schema}
    const vm = new Constructor({propsData: propsData, mixins: [VueForm]}).$mount()

    const fieldsets = vm.$el.getElementsByTagName('fieldset')
    expect(fieldsets.length).to.equal(3)

    const textFieldset = fieldsets[0]
    expect(textFieldset.getElementsByTagName('input').length).to.equal(1)

    const radioFieldset = fieldsets[1]
    expect(radioFieldset.getElementsByTagName('input').length).to.equal(3)

    const checkboxFieldset = fieldsets[2]
    expect(checkboxFieldset.getElementsByTagName('input').length).to.equal(3)
  })
})
