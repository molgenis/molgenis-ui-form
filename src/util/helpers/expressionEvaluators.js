import type { MapperSettings } from '../../flow.types'
/* global Expressions */

const tryEvaluate = (expression, data, errorResult: boolean, name, onErrorCallBack): boolean => {
  try {
    return !!Expressions.evaluate(expression, data)
  } catch (e) {
    const errorMessage = buildErrorMessage('Error evaluating expression', name, expression, e)
    evaluationLogging(errorMessage)
    if (typeof (onErrorCallBack) === 'function') {
      onErrorCallBack(new Error(errorMessage))
    }
    return errorResult
  }
}

/**
 * If there is a visible expression present, return a function which evaluates the expression.
 * If there is no expression present, check if mapper is run with showVisibleAttribute option set to true,
 * if this is not the case attributes visible property is used
 *
 * @param attribute
 * @param mapperOptions
 * @returns {Function} Function which evaluates to a boolean
 */
const isVisible = (attribute, mapperOptions: MapperSettings): ((?Object) => boolean) => {
  const visibleExpression = attribute.visibleExpression
  const resultWithoutExpression = mapperOptions.showNonVisibleAttributes || attribute.visible
  if (visibleExpression) {
    return (data, onErrorCallBack) =>
      tryEvaluate(visibleExpression, data, resultWithoutExpression, attribute, onErrorCallBack)
  }
  return () => resultWithoutExpression
}

/**
 * If there is a nullable expression present, return a function which evaluates said expression.
 * If there is no expression present, return a function which evaluates to the !value of attribute.nillable
 *
 * @param attribute
 * @returns {Function} Function which evaluates to a boolean
 */
const isRequired = (attribute): ((?Object) => boolean) => {
  const nullableExpression = attribute.nullableExpression

  // If an attribute is nullable, it is NOT required
  if (nullableExpression) {
    return (data, onErrorCallBack) => {
      const required = !tryEvaluate(nullableExpression, data, attribute.nillable, attribute.name, onErrorCallBack)
      const visibleExpression = attribute.visibleExpression
      if (required && visibleExpression) {
        // if visibleExpression evaluates to false, not required
        return tryEvaluate(visibleExpression, data, true, attribute.name, onErrorCallBack)
      }
      return required
    }
  }
  return () => !attribute.nillable
}

/**
 * If there is a validation expression present, return a function which evaluates said expression.
 * If there is no expression present, return a function which always evaluates to true
 *
 * @param attribute
 * @returns {Function} Function which evaluates to a boolean
 */
const isValid = (attribute): ((?Object) => boolean) => {
  const validationExpression = attribute.validationExpression
  if (validationExpression) {
    return (data, onErrorCallBack) => tryEvaluate(validationExpression, data, true, attribute.name, onErrorCallBack)
  }
  return () => true
}

/**
 * Helper function for logging data to the console on evaluation error
 *
 * @param errorMessage
 * @returns {*}
 */
const evaluationLogging = (errorMessage: string) => {
  if (console && console.warn) {
    console.warn(errorMessage)
  }
}

const buildErrorMessage = (message: string, field: string, expression: string, e: Error) => {
  return `${message} (field: ${field})
    ${expression}
    ${e.toString()}`
}

export { isValid, isRequired, isVisible }
