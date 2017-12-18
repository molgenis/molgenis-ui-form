import { createLocalVue, mount } from 'vue-test-utils'
import VueForm from 'vue-form'
import TextFieldComponent from '@/components/form-field-components/TextFieldComponent'

const localVue = createLocalVue()
localVue.use(VueForm)

describe('TextFieldComponent integration tests', () => {
  const state = {}
  const wrapper = mount(TextFieldComponent, {
    propsData: {value: '', state: state},
    localVue
  })

  it('should render label, description, and input tags', () => {
    console.log(wrapper.html())
    expect(wrapper.contains('input')).to.equal(true)
    expect(wrapper.contains('label')).to.equal(true)
    expect(wrapper.contains('small')).to.equal(true)
  })

  it('should load default data with the help of props', () => {
    expect(wrapper.vm.localValue).to.equal('')
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
        $invalid: true
      }
    })
    console.log(wrapper.find('input').classes())
  })
})
