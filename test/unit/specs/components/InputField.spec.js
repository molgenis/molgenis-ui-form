import Vue from 'vue'
import InputField from '../../../../src/components/field-components/InputField.vue'
import VueForm from 'vue-form'

describe('InputField Component', () => {
    // Inspect the raw component options
    it('should have a name equal to "typed-form-field"', () => {
        expect(InputField.name).to.equal('typed-form-field')
    })

    // Evaluate the results of functions in
    // the raw component options
    it('sets the correct default data', () => {
        expect(typeof InputField.data).to.equal('function')
        const defaultData = InputField.data()
        expect(defaultData.localValue).to.equal(undefined)
    })

    it('renders correctly', () => {
        // todo rename this property
        const fieldClassName = () => 'test-class'

        const inputFieldProperties = {
            field: {
                id: 'test-field-id',
                label: 'test input label',
                type: 'text'
            },
            value: 88,
            formState: {},
            fieldClassName: fieldClassName,
            required: false,

        }

        // Vue.use(VueForm)
        const inputFieldClass = Vue.extend(InputField)
        const inputField = new inputFieldClass({ propsData: inputFieldProperties }).$mount()
        expect(inputField.$el.textContent).to.equal('Hello')

    })
})