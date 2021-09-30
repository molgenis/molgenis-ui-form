import PseudonymRegistrationComponent from '@/components/field-types/PseudonymRegistrationComponent'
import { mount } from 'vue-test-utils'
import td from 'testdouble'
import api from '@molgenis/molgenis-api-client'

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

describe('PseudonymRegistrationComponent unit tests', () => {
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
      td.reset()
      const get = td.function('api.get')
      td.when(get('/api/v2/PseudonymRegistrationConfig?q=ID=like=PseudonymRegistration')).thenResolve(PseudonymRegistrationResponse)
      td.replace(api, 'get', get)

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
    /*
    it('renders correctly with minimal props', () => {
      expect(wrapper.contains('input')).to.equal(true)
      expect(wrapper.contains('label')).to.equal(true)
      expect(wrapper.contains('small')).to.equal(true)
    })
    */
    it('should load default data with the help of props', () => {
      expect(wrapper.vm.localValue).to.equal('hallo')
    })

    it('should render the label correctly', () => {
      expect(wrapper.contains('label')).to.equal(true)
      const label = wrapper.find('label')
      expect(label.text()).to.equal('Test Field')
      expect(label.element.htmlFor).to.equal('test-field')
    })

    it('should render the description correctly', () => {
      expect(wrapper.contains('small')).to.equal(true)
      const description = wrapper.find('small')
      expect(description.text()).to.equal('This is a test field')
      expect(description.element.id).to.equal('test-field-description')
      expect(description.element.className).to.equal('form-text text-muted')
    })
    /*
    it('should render the input correctly', () => {
      expect(wrapper.contains('input')).to.equal(true)
      const input = wrapper.find('input').element
      expect(input.id).to.equal('test-field')
      expect(input.name).to.equal('test-field')
      expect(input.type).to.equal('text')
      expect(input.required).to.equal(true)
      expect(input.className).to.equal(
        'form-control vf-pristine vf-invalid vf-untouched vf-invalid-validate')
    })
*/
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
