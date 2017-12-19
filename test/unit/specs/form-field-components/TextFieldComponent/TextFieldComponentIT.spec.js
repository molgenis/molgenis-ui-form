import { mount } from 'vue-test-utils'
import TextFieldComponent from '@/components/form-field-components/TextFieldComponent'

describe('TextFieldComponent integration tests', () => {
  const props = {
    value: 'init value',
    state: {}
  }

  const wrapper = mount(TextFieldComponent, {
    propsData: props
  })

  it('should render label, description, and input tags', () => {
    expect(wrapper.contains('input')).to.equal(true)
    expect(wrapper.contains('label')).to.equal(true)
    expect(wrapper.contains('small')).to.equal(true)
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
})
