import CheckboxFieldComponent from '@/components/field-types/CheckboxFieldComponent'
import { mount } from 'vue-test-utils'

describe('CheckboxFieldComponent unit tests', () => {
  const field = {
    id: 'checkbox-field',
    label: 'Checkbox Field',
    description: 'This is a checkbox field',
    type: 'checkbox',
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
        }
      ]
    }
  }

  const state = {
    $touched: false,
    $submitted: false,
    $invalid: false
  }

  const validate = () => {}

  const propsData = {
    value: undefined,
    field: field,
    state: state,
    validate: validate
  }

  it('should set empty array as localValue when value is undefined', () => {
    const wrapper = mount(CheckboxFieldComponent, {
      propsData: propsData,
      stubs: {'fieldMessages': '<div>This field is required</div>'}
    })

    expect(wrapper.vm.localValue).to.deep.equal([])
  })

  it('should set localValue if value is defined', () => {
    propsData.value = ['1']
    const wrapper = mount(CheckboxFieldComponent, {
      propsData: propsData,
      stubs: {'fieldMessages': '<div>This field is required</div>'}
    })

    expect(wrapper.vm.localValue).to.deep.equal(['1'])
  })
})
