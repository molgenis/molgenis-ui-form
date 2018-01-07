// import Vue from 'vue'
// import VueForm from 'vue-form'
// import FormComponent from '@/components/FormComponent'
//
// describe('FormComponent unit tests', () => {
//   it('should load the component with "FormComponent" as a name', () => {
//     expect(FormComponent.name).to.equal('FormComponent')
//   })
//
//   it('should have the correct props listed', () => {
//     const props = FormComponent.props
//     expect(typeof props.id).to.equal('object')
//     expect(typeof props.schema).to.equal('object')
//     expect(typeof props.data).to.equal('object')
//   })
//
//   it('should have the correct default data', () => {
//     expect(typeof FormComponent.data).to.equal('function')
//     const data = FormComponent.data()
//     expect(data.state).to.deep.equal({})
//   })
//
//   it('renders correctly with minimal props', () => {
//     const Constructor = Vue.extend(FormComponent)
//     const propsData = {id: 'test-form', schema: {fields: []}}
//     const vm = new Constructor({propsData: propsData, mixins: [VueForm]}).$mount()
//     expect(vm.$el.id).to.equal('test-form')
//   })
//
//   it('should throw a warning when field IDs are not unique', () => {
//     const Constructor = Vue.extend(FormComponent)
//     const schema = {
//       fields: [
//         {
//           type: 'text',
//           id: 'text-field',
//           label: 'Text field',
//           description: 'This is a cool text field',
//           visible: true,
//           required: true,
//           disabled: false,
//           validators: []
//         },
//         {
//           type: 'text',
//           id: 'text-field',
//           label: 'Text field',
//           description: 'This is a cool text field',
//           visible: true,
//           required: true,
//           disabled: false,
//           validators: []
//         }
//       ]
//     }
//
//     const spy = sinon.spy(console, 'log')
//
//     const propsData = {id: 'test-form', schema}
//     new Constructor({propsData: propsData, mixins: [VueForm]}).$mount()
//
//     expect(spy.args[0][0]).to.equal('Identifiers for fields inside your schema must be unique!')
//     console.log.restore()
//   })
//
//   it('renders correctly with real props', () => {
//     const Constructor = Vue.extend(FormComponent)
//     const schema = {
//       fields: [
//         {
//           type: 'text',
//           id: 'text-field',
//           label: 'Text field',
//           description: 'This is a cool text field',
//           visible: true,
//           required: true,
//           disabled: false,
//           validators: [
//             (data) => {
//               const value = data['text-field']
//               return value ? value.indexOf('test') !== -1 : true
//             }
//           ]
//         }
//       ]
//     }
//     const propsData = {id: 'test-form', schema}
//     const vm = new Constructor({propsData: propsData, mixins: [VueForm]}).$mount()
//     const expectedHTML = `<form novalidate="novalidate" class="vf-form-pristine vf-form-valid vf-form-untouched" id="test-form"><fieldset><div class="vf-field-pristine vf-field-valid vf-field-untouched"><div class="form-group"><label for="text-field">Text field</label> <input id="text-field" name="text-field" aria-describedby="text-field-description" required="required" type="text" vue-form-validator="" class="form-control form-control-lg vf-pristine vf-invalid vf-untouched vf-invalid-required"> <small id="text-field-description" class="form-text text-muted">
//       This is a cool text field
//     </small> <div class="form-control-feedback"></div></div></div></fieldset></form>`
//     expect(vm.$el.outerHTML).to.equal(expectedHTML)
//   })
// })
