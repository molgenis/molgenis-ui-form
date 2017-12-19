import TextFieldComponent from '@/components/form-field-components/TextFieldComponent'

describe('TextFieldComponent unit tests', () => {
  it('should load the TextFieldComponent with the proper name', () => {
    expect(TextFieldComponent.name).to.equal('text-field-component')
  })

  it('should have the correct default data', () => {
    expect(typeof TextFieldComponent.data).to.equal('function')
    const data = TextFieldComponent.data()
    expect(data.localValue).to.equal(undefined)
  })

  it('should have the correct props listed', () => {
    const props = TextFieldComponent.props
    expect(props).to.deep.equal(['value', 'state'])
  })

  it('should have a watcher on localValue', () => {
    expect(typeof TextFieldComponent.watch).to.equal('object')
    const watchers = TextFieldComponent.watch
    expect(typeof watchers.localValue).to.equal('function')
  })
})
