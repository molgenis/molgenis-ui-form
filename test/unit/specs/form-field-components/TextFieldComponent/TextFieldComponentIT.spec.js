import { mount } from 'vue-test-utils'
import TextFieldComponent from '@/components/form-field-components/TextFieldComponent'

describe('TextFieldComponent integration tests', () => {
  const props = {
    value: 'init value',
    field: {
      id: 'test-field',
      label: 'Test Field',
      description: 'This is a test field',
      type: 'text',
      visible: true,
      required: true,
      disabled: false,
      validators: [
        (value) => {
          const valid = value.indexOf('test') !== -1
          const message = valid ? '' : 'not valid value. Please include the word test'
          return {
            valid: valid,
            message: message
          }
        }
      ]
    },
    state: {
      $touched: false,
      $submitted: false,
      $invalid: false
    }
  }

  const wrapper = mount(TextFieldComponent, {
    propsData: props
  })

  it('should render the label correctly', () => {
    expect(wrapper.contains('label')).to.equal(true)
    const label = wrapper.find('label')
    expect(label.text()).to.equal('Test Field')
    expect(label.element.htmlFor).to.equal('test-field')
  })

  it('should render the input correctly', () => {
    expect(wrapper.contains('input')).to.equal(true)
    const input = wrapper.find('input').element
    expect(input.id).to.equal('test-field')
    expect(input.name).to.equal('test-field')
    expect(input.type).to.equal('text')
    expect(input.required).to.equal(true)
    expect(input.className).to.equal('form-control form-control-lg')
  })

  it('should render the description correctly', () => {
    expect(wrapper.contains('small')).to.equal(true)
    const description = wrapper.find('small')
    expect(description.text()).to.equal('This is a test field')
    expect(description.element.id).to.equal('test-field-description')
    expect(description.element.className).to.equal('form-text text-muted')
  })

  it('should load default data with the help of props', () => {
    expect(wrapper.vm.localValue).to.equal('init value')
  })

  it('should emit an updated value on change', () => {
    wrapper.setData({localValue: 'test'})
    expect(wrapper.emitted().input[0]).to.deep.equal(['test'])

    wrapper.setData({localValue: 'test another'})
    expect(wrapper.emitted().input[1]).to.deep.equal(['test another'])
  })

  it('should receive the "is-invalid" class if not valid', () => {
    wrapper.setData({
      state: {
        $touched: true,
        $invalid: true
      }
    })

    expect(wrapper.find('input').classes()).to.deep.equal(['form-control', 'form-control-lg', 'is-invalid'])
  })

  it('should show a field message if input is invalid', () => {
    wrapper.setData({
      state: {
        $touched: true,
        $invalid: true
      }
    })

    expect(wrapper.contains('field-messages')).to.equal(true)

    const fieldMessageElement = wrapper.find('field-messages')
    expect(fieldMessageElement.text()).to.equal('This field is required')
  })

  it('should run validators when the value is changed', () => {
    wrapper.setData({localValue: 'not valid'})
    console.log(wrapper.element)
  })
})
