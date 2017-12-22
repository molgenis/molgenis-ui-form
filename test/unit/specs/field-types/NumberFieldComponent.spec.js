import NumberFieldComponent from '@/components/field-types/NumberFieldComponent'
import { mount } from 'vue-test-utils'

describe('NumberFieldComponent unit tests', () => {
  const field = {
    id: 'number-field',
    label: 'Number Field',
    description: 'This is a number field',
    type: 'number',
    visible: true,
    required: true,
    disabled: false,
    validators: [
      (data) => {
        const value = data['text-field']
        return value ? value > 5 : true
      }
    ]
  }

  const state = {
    $touched: false,
    $submitted: false,
    $invalid: false
  }

  const validate = () => {}

  const propsData = {
    value: 1,
    field: field,
    state: state,
    validate: validate
  }

  const wrapper = mount(NumberFieldComponent,
    {
      propsData: propsData,
      stubs: {'fieldMessages': '<div>This field is required</div>'}
    }
  )

  it('should load the component with "NumberFieldComponent" as a name', () => {
    expect(NumberFieldComponent.name).to.equal('NumberFieldComponent')
  })

  it('renders correctly with minimal props', () => {
    expect(wrapper.contains('input')).to.equal(true)
    expect(wrapper.contains('label')).to.equal(true)
    expect(wrapper.contains('small')).to.equal(true)
  })

  it('should load default data with the help of props', () => {
    expect(wrapper.vm.localValue).to.equal(1)
  })

  it('should render the label correctly', () => {
    expect(wrapper.contains('label')).to.equal(true)
    const label = wrapper.find('label')
    expect(label.text()).to.equal('Number Field')
    expect(label.element.htmlFor).to.equal('number-field')
  })

  it('should render the description correctly', () => {
    expect(wrapper.contains('small')).to.equal(true)
    const description = wrapper.find('small')
    expect(description.text()).to.equal('This is a number field')
    expect(description.element.id).to.equal('number-field-description')
    expect(description.element.className).to.equal('form-text text-muted')
  })

  it('should render the input correctly', () => {
    expect(wrapper.contains('input')).to.equal(true)
    const input = wrapper.find('input').element
    expect(input.id).to.equal('number-field')
    expect(input.name).to.equal('number-field')
    expect(input.type).to.equal('number')
    expect(input.required).to.equal(true)
    expect(input.className).to.equal('form-control form-control-lg')
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
    expect(wrapper.contains('div.form-control-feedback')).to.equal(true)

    const fieldMessageElement = wrapper.find('div.form-control-feedback')
    expect(fieldMessageElement.text()).to.equal('This field is required')
  })
})
