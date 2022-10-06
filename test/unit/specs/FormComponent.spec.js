import FormComponent from '@/components/FormComponent'
import { shallow } from 'vue-test-utils'

describe('FormComponent unit tests', () => {
  it('should load the component with "FormComponent" as a name', () => {
    expect(FormComponent.name).to.equal('FormComponent')
  })

  it('should have the correct props listed', () => {
    const props = FormComponent.props
    expect(typeof props.id).to.equal('object')
    expect(typeof props.formFields).to.equal('object')
    expect(typeof props.initialFormData).to.equal('object')
    expect(typeof props.formState).to.equal('object')
    expect(typeof props.options).to.equal('object')
  })
})

describe('FormComponents shallow tests', () => {
  const field = {
    id: 'string',
    type: 'text',
    validate: (data) => data['string'] === 'data',
    visible: () => true,
    required: () => true
  }

  const formState = {
    'string': {
      $touched: false,
      $submitted: false,
      $invalid: false,
      _addControl: () => {}
    }
  }

  const propsData = {
    id: 'test',
    initialFormData: { 'string': 'data' },
    formFields: [field],
    formState: formState,
    options: {
      showEyeButton: true
    }
  }

  const wrapper = shallow(FormComponent, {
    propsData: propsData,
    mocks: {
      $t: () => 'mock i18n string'
    }
  })

  describe('toggle show optional fields', () => {
    it('should toggle to false', () => {
      wrapper.setData({ showOptionalFields: true })
      wrapper.vm.toggleOptionalFields()
      expect(wrapper.vm.showOptionalFields).to.equal(false)
    })
  })

  describe('Eye button visibility', () => {
    it('should show the eye button', () => {
      expect(wrapper.find('.hide-option-fields-btn-container').exists()).to.equal(true)
    })

    it('should not show the eye button', () => {
      wrapper.setProps({
        id: 'test',
        initialFormData: { 'string': 'data' },
        formFields: [field],
        formState: formState,
        options: {
          showEyeButton: false
        }
      })

      expect(wrapper.find('.hide-option-fields-btn-container').exists()).to.equal(false)
    })
  })

  describe('handleAddOptionEvent', () => {
    it('should emit add "addOptionRequest" event passing through the event params', () => {
      wrapper.vm.handleAddOptionEvent('a', 'b', 'c')
      expect(wrapper.emitted().addOptionRequest[0]).to.deep.equal(['a', 'b', 'c'])
    })
  })

  describe('handleValueChange', () => {
    it('should emit a valueChange event when data changes', () => {
      wrapper.vm.handleValueChange({ 'string': 'test event' })
      expect(wrapper.emitted().valueChange[0]).to.deep.equal([{ 'string': 'test event' }])
    })
  })

  describe('Eye messages i18m', () => {
    it('should return the default if i18n is not set', () => {
      const wrapper = shallow(FormComponent, {
        propsData: propsData,
        mocks: {
          $t: null
        }
      })

      expect(wrapper.vm.eyeMessage).to.equal('Hide optional fields')
    })
  })
})
