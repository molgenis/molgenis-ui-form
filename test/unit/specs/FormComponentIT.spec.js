// import { mount } from 'vue-test-utils'
// import FormComponent from '@/components/FormComponent'
//
// describe('FormComponent integration tests', () => {
//   describe('Form with a single text input, required only validation', () => {
//     const wrapper = mount(FormComponent, {
//       propsData: {value: '', state: {}}
//     })
//
//     it('should render label and input', () => {
//       expect(wrapper.contains('input')).to.equal(true)
//       expect(wrapper.contains('label')).to.equal(true)
//       expect(wrapper.contains('field-messages')).to.equal(true)
//     })
//
//     it('should load default data with the help of props', () => {
//       expect(wrapper.vm.localValue).to.equal('')
//     })
//
//     it('should emit an updated value on change', () => {
//       wrapper.setData({localValue: 'test'})
//       expect(wrapper.emitted().input[0]).to.deep.equal(['test'])
//
//       wrapper.setData({localValue: 'test another'})
//       expect(wrapper.emitted().input[1]).to.deep.equal(['test another'])
//     })
//
//     it('should receive the "is-invalid" class if not valid', () => {
//       wrapper.setProps({
//         state: {
//           $invalid: true
//         }
//       })
//     })
//   })
// })
