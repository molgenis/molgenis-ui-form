import TextFieldComponent from '@/components/form-field-components/TextFieldComponent'

describe('TextFieldComponent unit tests', () => {
  it('should load the component with "text-field-component" as a name', () => {
    expect(TextFieldComponent.name).to.equal('text-field-component')
  })

  it('should have the correct default data', () => {
    expect(typeof TextFieldComponent.data).to.equal('function')
    const data = TextFieldComponent.data()
    expect(data.localValue).to.equal(undefined)
  })

  it('should have the correct props listed', () => {
    const props = TextFieldComponent.props
    expect(props).to.deep.equal(['value', 'field', 'state'])
  })

  it('should have a validate method', () => {
    expect(typeof TextFieldComponent.methods).to.equal('object')
    const methods = TextFieldComponent.methods
    expect(typeof methods.validators).to.equal('function')
  })

  it('should have a watcher on localValue', () => {
    expect(typeof TextFieldComponent.watch).to.equal('object')
    const watchers = TextFieldComponent.watch
    expect(typeof watchers.localValue).to.equal('function')
  })
})
