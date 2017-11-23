import { mount } from 'vue-test-utils'
import TypedFormField from '../../../../src/components/field-components/TypedFormField.vue'

describe('TypedFormField tests', () => {
  describe('TypedFormField Component smoke tests', () => {
    it('should have a name equal to typed-form-field', () => {
      expect(TypedFormField.name).to.equal('typed-form-field')
    })

    it('should have the correct default data', () => {
      expect(typeof TypedFormField.data).to.equal('function')
      const data = TypedFormField.data()
      expect(data.localValue).to.equal(undefined)
    })

    it('should have the correct props listed', () => {
      const props = TypedFormField.props
      expect(props).to.deep.equal(['value', 'field', 'required', 'state'])
    })

    it('should have a watcher on localValue', () => {
      expect(typeof TypedFormField.watch).to.equal('object')
      const watchers = TypedFormField.watch
      expect(typeof watchers.localValue).to.equal('function')
    })
  })

  describe('TypedFormField Component render', () => {
    it('should render the Component correctly', () => {
      const props = {
        value: 'test',
        field: {
          type: 'text',
          id: 'text-field',
          label: 'Text field',
          description: 'This is a text field',
          required: true,
          disabled: false,
          readOnly: false,
          visible: true,
          options: [],
          validators: []
        },
        required: true,
        state: {
          $touched: true,
          $submitted: false,
          $invalid: false
        }
      }

      const wrapper = mount(TypedFormField, {
        propsData: props
      })

      // Test input
      expect(wrapper.contains('input')).to.equal(true)
      expect(wrapper.contains('label')).to.equal(true)
      expect(wrapper.contains('field-messages')).to.equal(true)
    })
  })
})