import type { MapperSettings } from '../../flow.types'
import { Expressions } from '@molgenis/expressions'

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
  const expression = attribute.visibleExpression

  if (expression) {
    return (data, onErrorCallBack) => {
      try {
        return Expressions.evaluate(expression, data)
      } catch (e) {
        const errorMessage = buildErrorMessage('Error evaluating visible expression', attribute.name, expression, e)
        evaluationLogging(errorMessage)
        const errorResult = mapperOptions.showNonVisibleAttributes || attribute.visible
        if (typeof (onErrorCallBack) === 'function') {
          onErrorCallBack(new Error(errorMessage))
        }
        return errorResult
      }
    }
  }
  return () => mapperOptions.showNonVisibleAttributes || attribute.visible
}

/**
 * If there is a nullable expression present, return a function which evaluates said expression.
 * If there is no expression present, return a function which evaluates to the !value of attribute.nillable
 *
 * @param attribute
 * @returns {Function} Function which evaluates to a boolean
 */
const isRequired = (attribute): ((?Object) => boolean) => {
  const expression = attribute.nullableExpression

  // If an attribute is nullable, it is NOT required
  if (expression) {
    return (data, onErrorCallBack) => {
      try {
        return !Expressions.evaluate(expression, data)
      } catch (e) {
        const errorMessage = buildErrorMessage('Error evaluating isRequired expression', attribute.name, expression, e)
        evaluationLogging(errorMessage)
        if (typeof (onErrorCallBack) === 'function') {
          onErrorCallBack(new Error(errorMessage))
        }
        return !attribute.nillable
      }
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
  const expression = attribute.validationExpression

  if (expression) {
    return (data, onErrorCallBack) => {
      try {
        return Expressions.evaluate(expression, data)
      } catch (e) {
        const errorMessage = buildErrorMessage('Error evaluating isValid expression', attribute.name, expression, e)
        evaluationLogging(errorMessage)
        if (typeof (onErrorCallBack) === 'function') {
          onErrorCallBack(new Error(errorMessage))
        }
        return true
      }
    }
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
