import TypedFieldComponent from '@/components/field-types/TypedFieldComponent'
import { mount } from 'vue-test-utils'

// Mock VeeValidate.Validator function
// Can be used to mock error lists for inputs
const validator = {
  fields: {
    find: () => ({
      update: () => ({})
    })
  }
}

// Mocks for vm.errors
const noError = {
  has: (id) => false,
  first: (id) => ''
}

const errors = {
  has: (id) => true,
  first: (id) => 'This field has errors'
}

describe('TypedFieldComponent unit tests', () => {
  describe('rendering a basic TypedFieldComponent correctly', () => {
    const propsData = {
      value: 'hello world',
      field: {
        type: 'text',
        id: 'simple-field',
        label: 'Simple field',
        description: 'This is a simple field',
        required: false
      }
    }

    const wrapper = mount(TypedFieldComponent, {
      propsData,
      mocks: {
        'errors': noError
      },
      provide: {
        '$validator': validator
      }
    })

    it('should load the component with "TypedFieldComponent" as a name', () => {
      expect(wrapper.name()).to.equal('TypedFieldComponent')
    })

    it('renders correctly with minimal props', () => {
      expect(wrapper.contains('input')).to.equal(true)
      expect(wrapper.contains('label')).to.equal(true)
      expect(wrapper.contains('small')).to.equal(true)
    })

    it('should load default data with the help of props', () => {
      expect(wrapper.vm.localValue).to.equal('hello world')
    })

    it('should render the label correctly', () => {
      const label = wrapper.find('label')
      expect(label.text()).to.equal('Simple field')
      expect(label.element.htmlFor).to.equal('simple-field')
    })

    it('should render the description correctly', () => {
      const description = wrapper.find('small')
      expect(description.text()).to.equal('This is a simple field')
      expect(description.element.id).to.equal('simple-field-description')
      expect(description.element.className).to.equal('form-text text-muted')
    })

    it('should render the input correctly', () => {
      const input = wrapper.find('input').element
      expect(input.id).to.equal('simple-field')
      expect(input.name).to.equal('simple-field')
      expect(input.type).to.equal('text')
      expect(input.required).to.equal(false)
      expect(input.className).to.equal('form-control form-control-lg')
    })

    it('should emit an updated value on change', () => {
      wrapper.setData({localValue: 'bye world'})
      expect(wrapper.emitted().input[0]).to.deep.equal(['bye world'])
      expect(wrapper.emitted().dataChange[0]).to.deep.equal([])

      wrapper.setData({localValue: 'hello again world'})
      expect(wrapper.emitted().input[1]).to.deep.equal(['hello again world'])
      expect(wrapper.emitted().dataChange[1]).to.deep.equal([])
    })
  })

  describe('Basic TypedFieldComponent error handling', () => {
    const propsData = {
      field: {
        type: 'text',
        id: 'error-field',
        label: 'Error field',
        description: 'This is an error field'
      }
    }

    const wrapper = mount(TypedFieldComponent, {
      propsData,
      mocks: {
        errors
      },
      provide: {
        '$validator': validator
      }
    })

    it('should render an input with the "is-invalid" class', () => {
      const input = wrapper.find('input')
      expect(input.classes()).to.deep.equal(['form-control', 'form-control-lg', 'is-invalid'])
    })

    it('should render an invalid-feedback div with an error message', () => {
      const errorDiv = wrapper.find('.invalid-feedback')
      expect(errorDiv.classes()).to.deep.equal(['invalid-feedback'])
      expect(errorDiv.text()).to.equal('This field has errors')
    })

    it('should trigger the custom validator on data input', () => {
      wrapper.setData({
        'localValue': 'trigger change'
      })
    })
  })

  describe('rendering TypedFieldComponent with different types', () => {
    const propsData = {
      value: 'hello world',
      field: {
        type: 'text',
        id: 'text-field',
        label: 'Text field',
        description: 'this is a text field',
        required: true,
        disabled: false,
        readOnly: false,
        visible: true
      }
    }

    const wrapper = mount(TypedFieldComponent, {
      propsData,
      mocks: {
        'errors': noError
      },
      provide: {
        '$validator': validator
      }
    })

    it('should render an input of type "text"', () => {
      expect(wrapper.find('input').element.type).to.equal('text')
    })

    it('should render an input of type "number"', () => {
      propsData.field.type = 'number'
      wrapper.setProps({propsData})
      expect(wrapper.find('input').element.type).to.equal('number')
    })

    it('should render an input of type "email"', () => {
      propsData.field.type = 'email'
      wrapper.setProps({propsData})
      expect(wrapper.find('input').element.type).to.equal('email')
    })

    it('should render an input of type "password"', () => {
      propsData.field.type = 'password'
      wrapper.setProps({propsData})
      expect(wrapper.find('input').element.type).to.equal('password')
    })

    it('should render an input of type "url"', () => {
      propsData.field.type = 'url'
      wrapper.setProps({propsData})
      expect(wrapper.find('input').element.type).to.equal('url')
    })
  })
})
