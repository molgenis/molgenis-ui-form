import TextAreaFieldComponent from '@/components/field-types/TextAreaFieldComponent'
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

describe('TextAreaFieldComponent unit tests', () => {
  describe('rendering a basic TextAreaFieldComponent correctly', () => {
    const propsData = {
      value: 'hello world',
      field: {
        type: 'text-area',
        id: 'simple-field',
        label: 'Simple field',
        description: 'This is a simple field',
        required: true
      }
    }

    const wrapper = mount(TextAreaFieldComponent, {
      propsData,
      mocks: {
        errors
      },
      provide: {
        '$validator': validator
      }
    })

    it('should load the component with "TextAreaFieldComponent" as a name', () => {
      expect(wrapper.name()).to.equal('TextAreaFieldComponent')
    })

    it('should set localValue if value is defined', () => {
      expect(wrapper.vm.localValue).to.deep.equal('hello world')
    })

    it('renders correctly with minimal props', () => {
      expect(wrapper.contains('textarea')).to.equal(true)
      expect(wrapper.contains('label')).to.equal(true)
      expect(wrapper.contains('small')).to.equal(true)
    })

    it('should emit an updated value on change', () => {
      wrapper.setData({localValue: 'test text area MESSAGE!!'})
      expect(wrapper.emitted().input[0]).to.deep.equal(['test text area MESSAGE!!'])
      expect(wrapper.emitted().dataChange[0]).to.deep.equal([])
    })
  })
})
