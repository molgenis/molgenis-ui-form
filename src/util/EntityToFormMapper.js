// @flow
import type { EntityFieldType, FieldOption, FormField, HtmlFieldType, RefEntityType } from '../flow.types'

import evaluator from './helpers/evaluator'
// $FlowFixMe
import api from '@molgenis/molgenis-api-client'

// Create an object type UserException
function MappingException (message: string) {
  this.message = message
  this.name = 'MappingException'
}

// Make the exception convert to a pretty string when used as a string
// (e.g. by the error console)
// Add flow flowfixme as a workaround for flow bug
// $FlowFixMe
MappingException.prototype.toString = function () {
  return this.name + ': "' + this.message + '"'
}

/**
 * Uses the idAttribute, labelAttribute, and hrefCollection parameters of the refEntity
 * to query a data table. Returns a list of {id, value, label} items as a Promise
 *
 * @param refEntity The refEntity of the attribute.
 * @param search An optional search query used to filter the items of the response
 * @param multiple An optional boolean specifying that the search value is an array of values
 * @return {Promise} Promise object representing an Array of FieldOption
 */
const fetchFieldOptions = (refEntity: RefEntityType, search: ?string | ?Array<string>): Promise<Array<FieldOption>> => {
  const idAttribute = refEntity.idAttribute
  const labelAttribute = refEntity.labelAttribute ? refEntity.labelAttribute : refEntity.idAttribute

  // map refEntity.hrefCollection v1 URLs to v2 to enable the use of RSQL queries
  let uri = refEntity.hrefCollection.replace('/v1/', '/v2/')

  if (search) {
    if (Array.isArray(search)) {
      // Join array into a string
      const value = search.join(',')
      // Use =in= query
      uri = uri + '?q=' + idAttribute + '=in=(' + value + '),' + labelAttribute + '=in=(' + value + ')'
    } else if (typeof search === 'string') {
      const value = search
      uri = uri + '?q=' + idAttribute + '=like=' + value + ',' + labelAttribute + '=like=' + value
    }
  }

  return api.get(uri).then(response => {
    return response.items.map(item => {
      return {
        id: item[idAttribute],
        value: item[idAttribute],
        label: item[labelAttribute]
      }
    })
  })
}

/**
 * Build a function that returns a Promise of an array containing objects of type FieldOption
 *
 * Simple types like STRING or TEXT do not have input properties, in this case 'null' is returned
 * The returned function returns a Promise of an array consisting of type FieldOption
 *
 * @example Example schema for generating field options
 * const schema = {
 *  fields: [
 *    {
 *      id: 'example',
 *      label: 'Example field',
 *      options: () => Promise.resolve([
 *          {
 *            id: '1',
 *            value: '1',
 *            label: 'Example option 1'
 *          },
 *          {
 *            id: '2',
 *            value: '2',
 *            label: 'Example option 2'
 *          }
 *        ]
 *    }
 *  ]
 * }
 *
 * @param attribute
 * @returns {Function|null} Function which returns a Promise representing an Array of FieldOptions
 */
const getFieldOptions = (attribute): ?(() => Promise<Array<FieldOption>>) => {
  switch (attribute.fieldType) {
    case 'CATEGORICAL':
    case 'CATEGORICAL_MREF':
    case 'ONE_TO_MANY':
    case 'XREF':
    case 'MREF':
      return (search: ?string | Array<string>): Promise<Array<FieldOption>> => {
        return fetchFieldOptions(attribute.refEntity, search).then(response => {
          return response
        })
      }
    case 'ENUM':
      const enumOptions = attribute.enumOptions.map(option => {
        return {
          id: option,
          value: option,
          label: option
        }
      })

      if (attribute.nillable) {
        enumOptions.push({id: 'null', value: 'null', label: 'N/A'})
      }

      return (): Promise<Array<FieldOption>> => Promise.resolve(enumOptions)
    case 'BOOL':
      const boolOptions = attribute.nillable ? [
        {id: 'true', value: 'true', label: 'True'},
        {id: 'false', value: 'false', label: 'False'},
        {id: 'null', value: 'null', label: 'N/A'}
      ] : [
        {id: 'true', value: 'true', label: 'True'},
        {id: 'false', value: 'false', label: 'False'}
      ]
      return (): Promise<Array<FieldOption>> => Promise.resolve(boolOptions)
    default:
      return null
  }
}

/**
 * Translate MOLGENIS attribute types to HTML field types
 *
 * @private
 * @param fieldType Attribute type e.g. STRING, XREF etc...
 * @returns {String} HTML type e.g. text, number, select etc...
 */
const getHtmlFieldType = (fieldType: EntityFieldType): HtmlFieldType => {
  switch (fieldType) {
    case 'BOOL':
    case 'CATEGORICAL':
    case 'ENUM':
      return 'radio'
    case 'XREF':
      return 'single-select'
    case 'ONE_TO_MANY':
    case 'MREF':
      return 'multi-select'
    case 'INT':
    case 'DECIMAL':
    case 'LONG':
      return 'number'
    case 'TEXT':
      return 'text-area'
    case 'SCRIPT':
      return 'script'
    case 'HTML':
      return 'html'
    case 'DATE':
      return 'date'
    case 'DATE_TIME':
      return 'date-time'
    case 'CATEGORICAL_MREF':
      return 'checkbox'
    case 'STRING':
      return 'text'
    case 'HYPERLINK':
      return 'url'
    case 'EMAIL':
      return 'email'
    case 'FILE':
      return 'file'
    case 'COMPOUND':
      return 'field-group'
    default:
      throw new MappingException(`unknown fieldType (${fieldType})`)
  }
}

/**
 * If there is a visible expression present, return a function which evaluates the expression.
 * If there is no expression present, return a function which evaluates to the value of attribute.visible
 *
 * @param attribute
 * @returns {Function} Function which evaluates to a boolean
 */
const isVisible = (attribute): ((?Object) => boolean) => {
  const expression = attribute.visibleExpression
  return expression ? (data) => evaluator(expression, data) : () => attribute.visible
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
  return expression ? (data) => !evaluator(expression, data) : () => !attribute.nillable
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
  return expression ? (data) => evaluator(expression, data) : () => true
}

/**
 * Generate a schema field object suitable for the forms
 *
 * @param attribute Attribute metadata from an EntityType V2 response
 * @returns {{type: String, id, label, description, required: boolean, disabled, visible, options: ({uri, id, label, multiple}|{uri, id, label})}}
 */
const generateFormSchemaField = (attribute): FormField => {
  // options is a function that always returns an array of option objects
  const options = getFieldOptions(attribute)
  let fieldProperties = {
    type: getHtmlFieldType(attribute.fieldType),
    id: attribute.name,
    label: attribute.label,
    description: attribute.description,
    required: isRequired(attribute),
    disabled: attribute.readOnly || attribute.fieldType === 'ONE_TO_MANY',
    readOnly: attribute.readOnly || attribute.fieldType === 'ONE_TO_MANY',
    visible: isVisible(attribute),
    validate: isValid(attribute)
  }

  if (fieldProperties.type === 'field-group') {
    const children = attribute.attributes.map(attribute => generateFormSchemaField(attribute))
    fieldProperties = {...fieldProperties, children}
  }

  return options ? {...fieldProperties, options} : fieldProperties
}

/**
 * Generates a data object suitable for the forms
 * Recursively calls itself when a field of type "field-group" is present
 * "field-group" fields do not have data, only their children do
 *
 * @param fields an array of field objects
 * @param data a data object containing everything a EntityType V2 response has in its item list
 * @param attributes an array of MOLGENIS attribute metadata, used for idAttribute
 * @returns a {fieldId: value} object
 */
const generateFormData = (fields: any, data: any, attributes: any) => {
  return fields.reduce((accumulator, field) => {
    const fieldAttribute = attributes.find(attribute => attribute.name === field.id)
    const idAttribute = fieldAttribute.refEntity && fieldAttribute.refEntity.idAttribute

    switch (field.type) {
      case 'field-group':
        // Recursively generate data for compounds
        return {...accumulator, ...generateFormData(field.children, data, fieldAttribute.attributes)}
      case 'file':
        // Map MOLGENIS FileMeta entity to our form file object
        // which only contains a name
        const fileData = data[field.id]
        accumulator[field.id] = fileData ? fileData.filename : data[field.id]
        break
      case 'checkbox':
      case 'multi-select':
        const checkboxData = data[field.id]
        accumulator[field.id] = checkboxData && checkboxData.map(data => data[idAttribute])
        break
      case 'radio':
      case 'single-select':
        const radioData = data[field.id]
        accumulator[field.id] = radioData && typeof radioData === 'object' ? radioData[idAttribute] : data[field.id]
        break
      default:
        accumulator[field.id] = data[field.id]
    }
    return accumulator
  }, {})
}

/**
 * Generates an array for form fields
 *
 * @param attributes A list of MOLGENIS attribute metadata
 * @returns a an array of Field objects
 */
const generateFormFields = (attributes: any): Array<FormField> => attributes.reduce((accumulator, attribute) => {
  accumulator.push(generateFormSchemaField(attribute))
  return accumulator
}, [])

/**
 * Generates both fields and data objects for rendering a form
 *
 * @param metadata MOLGENIS metadata, containing attributes
 * @param data
 * @returns {{formFields: Array<FormField>, formData: *}}
 */
const generateForm = (metadata: any, data: ?any) => {
  const attributes = metadata.attributes

  const formFields = generateFormFields(attributes)
  const formData = data ? generateFormData(formFields, data, attributes) : {}

  return {
    formFields,
    formData
  }
}

export default {
  generateForm
}
