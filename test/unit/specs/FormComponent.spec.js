import FormComponent from '@/components/FormComponent'

describe('FormComponent unit tests', () => {
  it('should load the FormComponent with the proper name', () => {
    expect(FormComponent.name).to.equal('form-component')
  })

  it('should have the correct default data', () => {
    expect(typeof FormComponent.data).to.equal('function')
    const data = FormComponent.data()
    expect(data.state).to.deep.equal({})
    expect(data.text).to.deep.equal('')
  })
})
