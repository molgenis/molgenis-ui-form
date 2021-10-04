/* eslint-disable no-unused-vars */
import PseudonymRegistrationComponent from '@/components/field-types/PseudonymRegistrationComponent'
import { mount } from 'vue-test-utils'
import td from 'testdouble'
import pseudonymRegistration from '@/util/helpers/pseudonymRegistration'

let PseudonymRegistrationResponse = {
  'items': [
    {
      'ID': 'PseudonymRegistration',
      'GeneratedTokenDescription': 'MyPseudonymID is cool for lost of reasons',
      'GeneratedTokenName': 'MyPseudonymID',
      'LinkEntityName': 'PseudonymConnector',
      'FieldName': 'umcgnr'
    }
  ]
}

const requestConfiguration = td.function('pseudonymRegistration.requestConfiguration')
td.when(requestConfiguration('PseudonymRegistration')).thenResolve(PseudonymRegistrationResponse)
td.replace(pseudonymRegistration, 'requestConfiguration', requestConfiguration)

describe.only('PseudonymRegistrationComponent unit tests', () => {
  const mockParentFunction = () => {
    return null
  }

  describe('TypedFieldComponent with type text', () => {
    const field = {
      id: 'PseudonymRegistration',
      label: 'Pseudonym Registration',
      description: 'Pseudonym Registration description',
      type: 'ExistingKey',
      disabled: false
    }

    const fieldState = {
      showOptionalFields: false,
      $touched: false,
      $submitted: false,
      $invalid: false,
      _addControl: mockParentFunction
    }

    const propsData = {
      value: 'hallo',
      field: field,
      fieldState: fieldState,
      isRequired: true,
      isValid: false,
      inputDebounceTime: 0
    }

    let wrapper
    beforeEach(() => {
      wrapper = mount(PseudonymRegistrationComponent,
        {
          propsData: propsData,
          stubs: { 'formFieldMessages': '<div class="form-control-feedback"><div class="invalid-feedback">This field is required</div></div>' }
        }
      )
    })

    it('should load the component with "PseudonymRegistrationComponent" as a name', () => {
      expect(PseudonymRegistrationComponent.name).to.equal('PseudonymRegistrationComponent')
    })
    it('renders correctly with minimal props', () => {
      expect(wrapper.contains('input')).to.equal(true)
      expect(wrapper.contains('label')).to.equal(true)
      expect(wrapper.contains('small')).to.equal(true)
    })
    it('should load default data with the help of props', () => {
      expect(wrapper.vm.localValue).to.equal('hallo')
    })

    it('should render the label correctly', () => {
      expect(wrapper.contains('label')).to.equal(true)
      const label = wrapper.find('label')
      expect(label.text()).to.equal('Pseudonym Registration')
      expect(label.element.htmlFor).to.equal('PseudonymRegistration')
    })

    it('should render the description correctly', () => {
      expect(wrapper.contains('small')).to.equal(true)
      const description = wrapper.find('small')
      expect(description.text()).to.equal('Pseudonym Registration description')
      expect(description.element.id).to.equal('PseudonymRegistration-description')
      expect(description.element.className).to.equal('form-text text-muted')
    })

    it('should render the input correctly', () => {
      expect(wrapper.contains('input')).to.equal(true)
      const input = wrapper.find('input').element
      expect(input.id).to.equal('PseudonymRegistration')
      expect(input.name).to.equal('PseudonymRegistration')
      expect(input.type).to.equal('text')
      expect(input.disabled).to.equal(true)
    })

    it('should have a working copy button', () => {
      expect(wrapper.contains('button#clipboard-btn')).to.equal(true)
    })

    /*
    it('should emit an updated value on change', (done) => {
      wrapper.setData({ localValue: 'test' })
      setTimeout(function () {
        expect(wrapper.emitted().input[0]).to.deep.equal(['test'])
        done()
      }, 1000)
    })
    it('should receive the "is-invalid" class if not valid', () => {
      wrapper.setData({
        fieldState: {
          $touched: true,
          $invalid: true
        }
      })

      expect(wrapper.find('input').classes()).to.deep.equal(['form-control', 'is-invalid',
        'vf-pristine', 'vf-invalid', 'vf-untouched', 'vf-invalid-validate'])
    })

    it('should show a field message if input is invalid', () => {
      wrapper.setData({
        fieldState: {
          $touched: true,
          $invalid: true
        }
      })
      expect(wrapper.contains('div.form-control-feedback')).to.equal(true)

      const fieldMessageElement = wrapper.find('div.form-control-feedback')
      expect(fieldMessageElement.text()).to.equal('This field is required')
    })
  })
*/
  })
})
