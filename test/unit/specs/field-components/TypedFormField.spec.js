import VueForm from 'vue-form'
import { createLocalVue, mount } from 'vue-test-utils'

import TypedFormField from '../../../../src/components/field-components/TypedFormField.vue'

describe('TypedFormField tests', () => {
  describe('TypedFormField Component smoke tests', () => {
    it('should have a name equal to "typed-form-field"', () => {
      expect(TypedFormField.name).to.equal('typed-form-field')
    })

    it('should have the correct default data', () => {
      expect(typeof TypedFormField.data).to.equal('function')
      const data = TypedFormField.data()
      expect(data.localValue).to.equal(undefined)
    })

    it('should have the correct props listed', () => {
      const props = TypedFormField.props
      expect(props).to.deep.equal(['value', 'field', 'required', 'state'])
    })

    it('should have a watcher on localValue', () => {
      expect(typeof TypedFormField.watch).to.equal('object')
      const watchers = TypedFormField.watch
      expect(typeof watchers.localValue).to.equal('function')
    })
  })

  describe('TypedFormField Component render', () => {
    it('should render the input field correctly', () => {
      const localVue = createLocalVue()
      localVue.use(VueForm)

      const wrapper = mount(TypedFormField, {
        localVue
      })

      wrapper.setProps({
        value: 'test',
        field: {
          type: 'text',
          id: 'text-field',
          label: 'Text field',
          description: 'This is a text field',
          required: true,
          disabled: false,
          readOnly: false,
          visible: true,
          options: [],
          validators: []
        },
        required: true,
        state: {}
      })
      console.log(wrapper)
    })
  })
})

// describe('Form generated with InputField', () => {
//   it('should generate a form with one text field', done => {
//     //   props: ['id', 'type', 'schema', 'data', 'readOnlyForm', 'onSubmit', 'onCancel'],
//     const props = {
//       id: 'form-with-text-only',
//       type: 'custom',
//       schema: {
//         'text': {
//           type: 'text',
//           id: 'text-field',
//           label: 'Text field',
//           description: 'This is a text field',
//           required: true,
//           disabled: false,
//           readOnly: false,
//           visible: true,
//           options: [],
//           validators: []
//         }
//       },
//       data: {'text-field': 'test value'},
//       readOnlyForm: false,
//       onSubmit: () => true,
//       onCancel: () => true
//     }
//
//     const Constructor = Vue.extend(MolgenisForm)
//     const vm = new Constructor({propsData: props}).$mount()
//
//     // https://stackoverflow.com/questions/3429218/unit-tests-for-html-output
//     Vue.nextTick(() => {
//       const inputElement = vm.$el.querySelector('input')
//
//       expect(inputElement.type).to.equal('text')
//       expect(inputElement.id).to.equal('text-field')
//       // const actualInput = vm.$el.querySelector('input')
//       // const expectedInput = '<input type="text" id="text-field" name="text-field" required="required" aria-describedby="text-field-description" vue-form-validator="" class="form-control vf-pristine vf-valid vf-untouched vf-pending">'
//       //
//       // expect(actualInput).to.equal(expectedInput)
//       done()
//     })
//   })
// })