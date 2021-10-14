/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import PseudonymRegistrationComponent from '@/components/field-types/PseudonymRegistrationComponent'
import { mount } from 'vue-test-utils'
import td from 'testdouble'
import pseudonymRegistration from '@/util/helpers/pseudonymRegistration'
import Vue from 'vue'

const config = {
  'ID': 'PseudonymRegistration',
  'GeneratedTokenDescription': 'MyPseudonymID is cool for lost of reasons',
  'GeneratedTokenName': 'MyPseudonymID',
  'LinkEntityName': 'PseudonymConnector',
  'FieldName': 'OriginalID'
}

const PseudonymRegistrationResponse = {
  'items': [
    config
  ]
}
const pseudonymID = 'PseudonymID'
const requestConfiguration = td.function('pseudonymRegistration.requestConfiguration')
const submitPseudonymRegistration = td.function('pseudonymRegistration.submitPseudonymRegistration')

describe('PseudonymRegistrationComponent unit tests', () => {
  const mockParentFunction = () => {
    return null
  }

  describe('PseudonymRegistrationComponent with existing record', () => {
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
      const requestConfiguration = td.function('pseudonymRegistration.requestConfiguration')
      td.when(requestConfiguration('PseudonymRegistration')).thenResolve(PseudonymRegistrationResponse)
      td.replace(pseudonymRegistration, 'requestConfiguration', requestConfiguration)

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
  })

  describe('PseudonymRegistrationComponent creating a new record', () => {
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
      value: null,
      field: field,
      fieldState: fieldState,
      isRequired: true,
      isValid: false,
      inputDebounceTime: 0
    }

    let wrapper
    beforeEach(() => {
      td.reset()
      td.when(requestConfiguration('PseudonymRegistration')).thenResolve(PseudonymRegistrationResponse)
      td.replace(pseudonymRegistration, 'requestConfiguration', requestConfiguration)
      wrapper = mount(PseudonymRegistrationComponent,
        {
          propsData: propsData,
          stubs: { 'formFieldMessages': '<div class="form-control-feedback"><div class="invalid-feedback">This field is required</div></div>' }
        }
      )
    })

    it('should have a button to start creating a pseudonym', (done) => {
      setTimeout(function () {
        expect(wrapper.contains('#pseudonym-create-btn')).to.equal(true)
        done()
      })
    })

    it('should have a input field after clicking the creat-id button', (done) => {
      setTimeout(function () {
        wrapper.find('#pseudonym-create-btn').trigger('click')
        setTimeout(function () {
          expect(wrapper.contains('#OriginalID')).to.equal(true)
          done()
        })
      })
    })

    it('should have return after clicking the form cancel button', (done) => {
      setTimeout(function () {
        wrapper.find('#pseudonym-create-btn').trigger('click')
        setTimeout(function () {
          wrapper.find('#pseudonym-cancel-btn').trigger('click')
          setTimeout(function () {
            expect(wrapper.contains('#pseudonym-create-btn')).to.equal(true)
            done()
          })
        })
      })
    })

    it.only('should generate a new ID on save', (done) => {
      td.when(submitPseudonymRegistration(config, 'id')).thenResolve(pseudonymID)
      td.replace(pseudonymRegistration, 'submitPseudonymRegistration', submitPseudonymRegistration)

      wrapper.vm.originalID = 'id'
      const idToClipboard = td.function('idToClipboard')

      wrapper.vm.idToClipboard = idToClipboard
      Vue.nextTick(() => {
        wrapper.vm.onSubmitPseudonymRegistration()
        Vue.nextTick(() => {
          td.verify(idToClipboard(pseudonymID))
          done()
        })
      })
    })
  })
})
