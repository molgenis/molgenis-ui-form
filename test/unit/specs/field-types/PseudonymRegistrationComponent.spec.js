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

  describe('PseudonymRegistrationComponent with existing record', () => {
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

    describe('idToClipboard', () => {
      it('should write the pseudonym to the clipboard and make the send boolean true', (done) => {
        const tmp = navigator.clipboard.writeText
        navigator.clipboard.writeText = td.function('navigator.clipboard.writeText')
        td.when(navigator.clipboard.writeText(pseudonymID)).thenResolve()
        Vue.nextTick(() => {
          wrapper.vm.idToClipboard(pseudonymID)
          Vue.nextTick(() => {
            expect(wrapper.vm.sendToClipboard).to.be.true
            navigator.clipboard.writeText = tmp
            done()
          })
        })
      })
    })

    describe('onSubmitPseudonymRegistration', () => {
      it('should return a new ID on save', (done) => {
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

      it('Should set the error, if one occurs during pseudonimisation', (done) => {
        const ERROR_MESSAGE = 'ErrorMessage'
        td.when(submitPseudonymRegistration(config, 'id')).thenReject(ERROR_MESSAGE)
        td.replace(pseudonymRegistration, 'submitPseudonymRegistration', submitPseudonymRegistration)
        wrapper.vm.originalID = 'id'
        Vue.nextTick(() => {
          wrapper.vm.onSubmitPseudonymRegistration()
          Vue.nextTick(() => {
            expect(wrapper.vm.error).to.equal(ERROR_MESSAGE)
            done()
          })
        })
      })
    })

    describe('requestConfig', () => {
      it('should load the config onto the scope and set loaded to true', (done) => {
        const response = { items: [{ some: 'config' }] }
        td.when(requestConfiguration(wrapper.vm.field.id)).thenResolve(response)
        Vue.nextTick(() => {
          wrapper.vm.requestConfig()
          Vue.nextTick(() => {
            expect(wrapper.vm.config).to.deep.equal(response.items[0])
            expect(wrapper.vm.loaded).to.be.true
            done()
          })
        })
      })

      it('should set the error if no config is returned', (done) => {
        const EMPTY_RESPONSE_ERROR_MESSAGE = 'Error: Please contact a system administator'
        const emptyResponse = { items: [] }
        td.when(requestConfiguration(wrapper.vm.field.id)).thenResolve(emptyResponse)
        Vue.nextTick(() => {
          wrapper.vm.requestConfig()
          Vue.nextTick(() => {
            expect(wrapper.vm.error).to.equal(EMPTY_RESPONSE_ERROR_MESSAGE)
            expect(wrapper.vm.loaded).to.be.false
            done()
          })
        })
      })

      it('should set the error if getting the config fails', (done) => {
        const CONNECTION_ERROR_MESSAGE = 'Connection error. Please check you internet connection or contact a system administator'
        td.when(requestConfiguration(wrapper.vm.field.id)).thenReject()
        Vue.nextTick(() => {
          wrapper.vm.requestConfig()
          Vue.nextTick(() => {
            expect(wrapper.vm.error).to.equal(CONNECTION_ERROR_MESSAGE)
            expect(wrapper.vm.loaded).to.be.false
            done()
          })
        })
      })
    })

    describe('reset', () => {
      it('should put back the default values and request a new config', (done) => {
        wrapper.vm.requestConfig = td.function()
        Vue.nextTick(() => {
          wrapper.vm.reset()
          Vue.nextTick(() => {
            expect(wrapper.vm.showForm).to.be.false
            expect(wrapper.vm.loaded).to.be.false
            expect(wrapper.vm.error).to.equal('')
            expect(wrapper.vm.sendToClipboard).to.be.false
            td.verify(wrapper.vm.requestConfig())
            done()
          })
        })
      })
    })
  })
})
