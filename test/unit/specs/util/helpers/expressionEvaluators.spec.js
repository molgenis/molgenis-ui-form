import { isValid, isRequired, isVisible } from '@/util/helpers/expressionEvaluators'

describe('expressionEvaluators', () => {
  const attribute = {
    name: 'name',
    visible: true,
    nillable: true,
    validationExpression: '{name} != "not valid"',
    visibleExpression: '{name} empty',
    nullableExpression: '{name} != "not valid"'
  }

  const attributeTruthyTest = {
    name: 'name',
    visible: true,
    nillable: true,
    validationExpression: '{valid}',
    visibleExpression: '{visible}',
    nullableExpression: '{nullable}'
  }

  const mapperOptions = {
    showNonVisibleAttributes: false
  }

  describe('isValid', () => {
    it('validates correctly via expression', () => {
      expect(isValid(attribute)({ 'name': '' })).to.equal(true)
      expect(isValid(attribute)({ 'name': 'not valid' })).to.equal(false)
    })
    it('uses truthiness of expression value', () => {
      expect(isValid(attributeTruthyTest)({})).to.equal(false)
      expect(isValid(attributeTruthyTest)({ valid: 'foo' })).to.equal(true)
    })
    it('Falls back to the true on script error', () => {
      attribute.validationExpression = '% // Note: forced error'
      expect(isValid(attribute)({ 'name': '' })).to.equal(true)
    })
    it('Calls the onErrorCallBack if passed a callback function', () => {
      attribute.validationExpression = '% // Note: forced error'
      let callBackHasBeenCalled = false
      isValid(attribute, mapperOptions)({ 'name': '' }, () => { callBackHasBeenCalled = true })
      expect(callBackHasBeenCalled).to.equal(true)
    })
  })

  describe('isVisible', () => {
    it('validates correctly via expression', () => {
      expect(isVisible(attribute, mapperOptions)({ 'name': '' })).to.equal(true)
      expect(isVisible(attribute, mapperOptions)({ 'name': 'something' })).to.equal(false)
    })
    it('uses truthiness of expression value', () => {
      expect(isVisible(attributeTruthyTest, mapperOptions)({})).to.equal(false)
      expect(isVisible(attributeTruthyTest, mapperOptions)({ visible: 'foo' })).to.equal(true)
    })
    it('Falls back to the default "visible" value on script error', () => {
      attribute.visibleExpression = '% // Note: forced SyntaxError'
      expect(isVisible(attribute, mapperOptions)({ 'name': 'name' })).to.equal(true)
      attribute.visible = false
      expect(isVisible(attribute, mapperOptions)({ 'name': 'name' })).to.equal(false)
    })
    it('Calls the onErrorCallBack if passed a callback function', () => {
      attribute.visibleExpression = '% // Note: forced SyntaxError'
      let callBackHasBeenCalled = false
      isVisible(attribute, mapperOptions)({ 'name': 'name' }, () => { callBackHasBeenCalled = true })
      expect(callBackHasBeenCalled).to.equal(true)
    })
  })

  describe('isRequired', () => {
    it('validates correctly via expression', () => {
      expect(isRequired(attribute, mapperOptions)({ 'name': '' })).to.equal(false)
      expect(isRequired(attribute, mapperOptions)({ 'name': 'not valid' })).to.equal(true)
    })
    it('uses truthiness of expression value', () => {
      expect(isRequired(attributeTruthyTest)({ visible: true })).to.equal(true)
      expect(isRequired(attributeTruthyTest)({ nullable: 'foo', visible: true })).to.equal(false)
    })
    it('is false when visible expression hides the attribute', () => {
      expect(isRequired(attributeTruthyTest)({ nullable: false, visible: false })).to.equal(false)
    })
    it('Falls back to the default "nillable" value on script error', () => {
      attribute.nullableExpression = '% // Note: forced SyntaxError'
      expect(isRequired(attribute)({ 'name': 'name' })).to.equal(false)
      attribute.nillable = false
      expect(isRequired(attribute)({ 'name': 'name' })).to.equal(true)
    })
    it('Calls the onErrorCallBack if passed a callback function', () => {
      attribute.nullableExpression = '% // Note: forced SyntaxError'
      let callBackHasBeenCalled = false
      isRequired(attribute, mapperOptions)({ 'name': 'name' }, () => { callBackHasBeenCalled = true })
      expect(callBackHasBeenCalled).to.equal(true)
    })
  })
})
