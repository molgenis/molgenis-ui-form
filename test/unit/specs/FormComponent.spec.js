import FormComponent from '@/components/FormComponent'

describe('FormComponent unit tests', () => {
  it('should load the component with "form-component" as a name', () => {
    expect(FormComponent.name).to.equal('form-component')
  })

  it('should have the correct props listed', () => {
    const props = FormComponent.props
    expect(typeof props.id).to.equal('object')
    expect(typeof props.schema).to.equal('object')
    expect(typeof props.data).to.equal('object')
  })

  it('should have the correct default data', () => {
    expect(typeof FormComponent.data).to.equal('function')
    const data = FormComponent.data()
    expect(data.state).to.deep.equal({})
  })
})
