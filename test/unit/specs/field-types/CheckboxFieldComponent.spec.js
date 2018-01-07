import CheckboxFieldComponent from '@/components/field-types/CheckboxFieldComponent'
import { mount } from 'vue-test-utils'

const validator = {
  fields: {
    find: () => ({
      update: () => ({})
    })
  }
}

const errors = {
  has: (id) => false,
  first: (id) => ''
}

describe('CheckboxFieldComponent unit tests', () => {
  describe('rendering a basic CheckboxFieldComponent correctly', () => {
    const propsData = {
      field: {
        id: 'checkbox-field',
        label: 'Checkbox Field',
        description: 'This is a checkbox field',
        type: 'checkbox',
        visible: true,
        required: true,
        disabled: false,
        validators: [],
        options: () => {
          return new Promise((resolve) => {
            resolve([
              {
                id: '1',
                label: 'Option 1',
                value: '1'
              }
            ])
          })
        }
      }
    }

    const wrapper = mount(CheckboxFieldComponent, {
      propsData,
      mocks: {
        errors
      },
      provide: {
        '$validator': validator
      }
    })

    it('should load the component with "CheckboxFieldComponent" as a name', () => {
      expect(wrapper.name()).to.equal('CheckboxFieldComponent')
    })

    it('should set empty array as localValue when value is undefined', () => {
      expect(wrapper.vm.localValue).to.deep.equal([])
    })

    it('should render an input for every option', () => {
      const inputs = wrapper.findAll('input')
      expect(inputs.at(0).element.id).to.equal('checkbox-field-0')
    })

    it('should emit an updated value on change', () => {
      wrapper.setData({localValue: ['1']})
      expect(wrapper.emitted().input[0]).to.deep.equal([['1']])
      expect(wrapper.emitted().dataChange[0]).to.deep.equal([])
    })
  })
})
