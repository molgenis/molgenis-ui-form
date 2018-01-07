import RadioFieldComponent from '@/components/field-types/RadioFieldComponent'
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

describe('RadioFieldComponent unit tests', () => {
  describe('rendering a basic RadioFieldComponent correctly', () => {
    const propsData = {
      field: {
        id: 'radio-field',
        label: 'Radio field',
        description: 'This is a nice radio button selection',
        type: 'radio',
        visible: true,
        required: true,
        disabled: false,
        validators: [],
        options: () => {
          return new Promise((resolve, reject) => {
            resolve([
              {
                id: 'id1',
                label: 'Option 1',
                value: '1'
              },
              {
                id: 'id2',
                label: 'Option 2',
                value: '2'
              },
              {
                id: 'id3',
                label: 'Option 3',
                value: '3'
              }
            ])
          })
        }
      }
    }

    const wrapper = mount(RadioFieldComponent, {
      propsData,
      mocks: {
        errors
      },
      provide: {
        '$validator': validator
      }
    })

    it('should load the component with "RadioFieldComponent" as a name', () => {
      expect(wrapper.name()).to.equal('RadioFieldComponent')
    })

    it('should set empty array as localValue when value is undefined', () => {
      expect(wrapper.vm.localValue).to.deep.equal(undefined)
    })

    it('should render an input for every option', () => {
      const inputs = wrapper.findAll('input')

      expect(inputs.at(0).element.id).to.equal('radio-field-0')
      expect(inputs.at(1).element.id).to.equal('radio-field-1')
      expect(inputs.at(2).element.id).to.equal('radio-field-2')
    })

    it('should emit an updated value on change', () => {
      wrapper.setData({localValue: '1'})
      expect(wrapper.emitted().input[0]).to.deep.equal(['1'])
      expect(wrapper.emitted().dataChange[0]).to.deep.equal([])
    })
  })
})
