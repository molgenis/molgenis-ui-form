import VueForm from 'vue-form'
import { mount, createLocalVue } from 'vue-test-utils'

import TypedFormField from '../../../../src/components/field-components/TypedFormField.vue'
const localVue = createLocalVue()
localVue.use(VueForm)

describe('InputField Component smoke test', () => {
  it('should have a name equal to "typed-form-field"', () => {
    expect(TypedFormField.name).to.equal('typed-form-field')
  })

  it('should set the correct default data', () => {
    expect(typeof TypedFormField.data).to.equal('function')
    const defaultData = TypedFormField.data()
    expect(defaultData.localValue).to.equal(undefined)
  })

  it('should render the input field correctly', () => {
    const wrapper = mount(TypedFormField, {
      localVue
    })
    console.log(wrapper)
  })
})